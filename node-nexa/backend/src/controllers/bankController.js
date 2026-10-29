import mongoose from 'mongoose';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { publicUser } from './authController.js';

const MIN_TRANSFER = 10_000;
const MAX_TRANSFER = 10_000_000;
const DAILY_TRANSFER_LIMIT = 20_000_000;

// Mengambil saldo dan ringkasan rekening user yang sedang login.
export function getBalance(req, res) { return res.json({ user: publicUser(req.user) }); }

// Mengambil riwayat transaksi yang melibatkan user aktif.
export async function getTransactions(req, res, next) {
  try {
    const data = await Transaction.find({ $or: [{ sender: req.user._id }, { recipient: req.user._id }] })
      .populate('sender recipient', 'name accountNumber').sort({ date: -1 }).limit(50);
    res.json({ data });
  } catch (error) { next(error); }
}

// Memproses transfer atomik, mencatat transaksi, lalu emit saldo terbaru ke dua user.
export async function transfer(req, res, next) {
  const session = await mongoose.startSession();
  try {
    const { recipientAccountNumber, amount } = req.body;
    const value = Number(amount);
    if (!recipientAccountNumber || !/^[0-9]{10}$/.test(recipientAccountNumber) || !Number.isInteger(value) || value < MIN_TRANSFER || value > MAX_TRANSFER)
      return res.status(400).json({ message: 'Nomor rekening penerima dan nominal valid wajib diisi.' });
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const daily = await Transaction.aggregate([{ $match: { sender: req.user._id, type: 'Transfer', date: { $gte: startOfDay } } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    if ((daily[0]?.total || 0) + value > DAILY_TRANSFER_LIMIT) return res.status(400).json({ message: 'Batas transfer harian Rp20.000.000 telah tercapai.' });
    const idempotencyKey = req.headers['idempotency-key'];
    if (idempotencyKey) { const previous = await Transaction.findOne({ idempotencyKey }); if (previous) return res.status(200).json({ message: 'Transfer sudah pernah diproses.', transaction: previous }); }
    const recipient = await User.findOne({ accountNumber: recipientAccountNumber }).session(session);
    if (!recipient || recipient.id === req.user.id) return res.status(400).json({ message: 'Penerima tidak valid.' });
    session.startTransaction();
    const debit = await User.updateOne({ _id: req.user._id, balance: { $gte: value } }, { $inc: { balance: -value } }, { session });
    if (!debit.modifiedCount) throw Object.assign(new Error('Saldo tidak mencukupi.'), { status: 400 });
    await User.updateOne({ _id: recipient._id }, { $inc: { balance: value } }, { session });
    const [transaction] = await Transaction.create([{ sender: req.user._id, recipient: recipient._id, amount: value, type: 'Transfer', idempotencyKey }], { session });
    await session.commitTransaction();
    const [sender, updatedRecipient] = await Promise.all([User.findById(req.user._id), User.findById(recipient._id)]);
    req.io.to(`user:${req.user.id}`).emit('balance:updated', publicUser(sender));
    req.io.to(`user:${recipient.id}`).emit('balance:updated', publicUser(updatedRecipient));
    req.io.to(`user:${req.user.id}`).emit('transaction:created', transaction);
    req.io.to(`user:${recipient.id}`).emit('transaction:created', transaction);
    res.status(201).json({ message: 'Transfer berhasil.', transaction, user: publicUser(sender) });
  } catch (error) { if (session.inTransaction()) await session.abortTransaction(); next(error); }
  finally { session.endSession(); }
}

// Mensimulasikan top up dan mengirim perubahan saldo secara realtime.
export async function topup(req, res, next) {
  try {
    const value = Number(req.body.amount);
    if (!Number.isInteger(value) || value <= 0) return res.status(400).json({ message: 'Nominal top up tidak valid.' });
    const user = await User.findByIdAndUpdate(req.user._id, { $inc: { balance: value } }, { new: true });
    const transaction = await Transaction.create({ recipient: user._id, amount: value, type: 'Topup' });
    req.io.to(`user:${user.id}`).emit('balance:updated', publicUser(user));
    req.io.to(`user:${user.id}`).emit('transaction:created', transaction);
    res.status(201).json({ message: 'Top up berhasil.', transaction, user: publicUser(user) });
  } catch (error) { next(error); }
}
