import mongoose from 'mongoose';
const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: Number, required: true, default: 0 },
});
const Counter = mongoose.model('Counter', counterSchema);
export async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findOneAndUpdate({ name: sequenceName }, { $inc: { value: 1 } }, { new: true, upsert: true });
    return sequenceDocument.value;
}
export default Counter;
