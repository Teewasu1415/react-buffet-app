import { useState } from "react";

const ADULT_PRICE = 299;
const CHILD_PRICE = 89;
const REFILL_PRICE = 29; // ต่อคน (ผู้ใหญ่และเด็ก)
const WATER_PRICE = 10; // ต่อขวด
const SOFT_DRINK_PRICE = 25; // ต่อขวด

const DISCOUNTS = [
  { value: 0, label: "ไม่มีส่วนลด" },
  { value: 10, label: "ส่วนลด 10%" },
  { value: 15, label: "ส่วนลด 15%" },
  { value: 20, label: "ส่วนลด 20%" },
];

const initialForm = {
  adults: "",
  children: "",
  drinkType: "refill", // "refill" | "bottle"
  water: "",
  softDrink: "",
  discount: 0,
};

// ว่าง = null, ไม่ใช่จำนวนเต็มตั้งแต่ 0 = NaN
const parseCount = (v) => {
  if (v === "") return null;
  const n = Number(v);
  return Number.isInteger(n) && n >= 0 ? n : NaN;
};

const formatBaht = (n) =>
  n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const inputClass =
  "h-11 w-full rounded-[10px] border-[1.5px] border-gray-300 bg-white px-3 text-[0.95rem] " +
  "focus:border-indigo-600 focus:outline-2 focus:outline-offset-1 focus:outline-indigo-600 " +
  "disabled:cursor-not-allowed disabled:bg-gray-100";

const labelClass = "mb-1.5 block text-[0.8rem] text-gray-600";

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const isRefill = form.drinkType === "refill";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrinkType = (e) => {
    const drinkType = e.target.value;
    // เลือกรีฟิล -> ล้างจำนวนน้ำขวดทิ้ง
    setForm((prev) =>
      drinkType === "refill"
        ? { ...prev, drinkType, water: "", softDrink: "" }
        : { ...prev, drinkType }
    );
  };

  const handleCalculate = () => {
    const adults = parseCount(form.adults);
    const children = parseCount(form.children);
    const water = parseCount(form.water);
    const softDrink = parseCount(form.softDrink);

    if (adults === null && children === null) {
      setError("กรุณาป้อนจำนวนผู้ใหญ่หรือจำนวนเด็กอย่างน้อย 1 ช่อง");
      setTotal(0);
      return;
    }
    if (Number.isNaN(adults) || Number.isNaN(children)) {
      setError("จำนวนผู้ใหญ่และเด็กต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป");
      setTotal(0);
      return;
    }
    if (!isRefill && (Number.isNaN(water) || Number.isNaN(softDrink))) {
      setError("จำนวนเครื่องดื่มต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป");
      setTotal(0);
      return;
    }

    setError("");

    const a = adults ?? 0;
    const c = children ?? 0;

    // ค่าอาหาร (ลดเฉพาะส่วนนี้)
    const food = a * ADULT_PRICE + c * CHILD_PRICE;
    const foodAfterDiscount = food * (1 - Number(form.discount) / 100);

    // ค่าเครื่องดื่ม (ไม่ลด)
    const drinks = isRefill
      ? (a + c) * REFILL_PRICE
      : (water ?? 0) * WATER_PRICE + (softDrink ?? 0) * SOFT_DRINK_PRICE;

    setTotal(foodAfterDiscount + drinks);
  };

  const handleReset = () => {
    setForm(initialForm);
    setError("");
    setTotal(0);
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-100 px-4 py-7">
      <div className="w-full max-w-[400px] rounded-[20px] bg-white px-5 py-7 shadow-xl">
        <h1 className="text-center text-[1.35rem] font-bold text-gray-900">
          Buffet Calculator
        </h1>
        <p className="mt-1 text-center text-[0.85rem] text-gray-500">
          คำนวณค่าอาหารบุฟเฟต์
        </p>

        <div className="mb-6 mt-5 flex justify-center">
          {/* วางไฟล์โลโก้ไว้ที่ public/logo.svg */}
          <img src="/logo.svg" alt="โลโก้ร้าน" className="h-12 w-auto" />
        </div>

        <label className="mb-4 block">
          <span className={labelClass}>จำนวนผู้ใหญ่ (คนละ {ADULT_PRICE} บาท)</span>
          <input
            type="number"
            name="adults"
            min="0"
            step="1"
            value={form.adults}
            onChange={handleChange}
            className={inputClass}
          />
        </label>

        <label className="mb-4 block">
          <span className={labelClass}>จำนวนเด็ก (คนละ {CHILD_PRICE} บาท)</span>
          <input
            type="number"
            name="children"
            min="0"
            step="1"
            value={form.children}
            onChange={handleChange}
            className={inputClass}
          />
        </label>

        <fieldset className="mb-4 rounded-[10px] border border-gray-300 px-3.5 pb-1 pt-3">
          <legend className="px-1.5 text-[0.8rem] text-gray-500">เครื่องดื่ม</legend>

          <label className="mb-2.5 flex cursor-pointer items-center gap-2 text-[0.88rem]">
            <input
              type="radio"
              name="drinkType"
              value="refill"
              checked={isRefill}
              onChange={handleDrinkType}
              className="accent-blue-600"
            />
            <strong className="font-semibold">
              น้ำรีฟิล คนละ {REFILL_PRICE} บาท (ผู้ใหญ่และเด็ก)
            </strong>
          </label>

          <label className="mb-2.5 flex cursor-pointer items-center gap-2 text-[0.88rem]">
            <input
              type="radio"
              name="drinkType"
              value="bottle"
              checked={!isRefill}
              onChange={handleDrinkType}
              className="accent-blue-600"
            />
            <strong className="font-semibold">เครื่องดื่มแบบขวด</strong>
          </label>

          <label className="mb-4 block">
            <span className={labelClass}>น้ำเปล่า (ขวดละ {WATER_PRICE} บาท)</span>
            <input
              type="number"
              name="water"
              min="0"
              step="1"
              value={form.water}
              onChange={handleChange}
              disabled={isRefill}
              className={inputClass}
            />
          </label>

          <label className="mb-4 block">
            <span className={labelClass}>น้ำอัดลม (ขวดละ {SOFT_DRINK_PRICE} บาท)</span>
            <input
              type="number"
              name="softDrink"
              min="0"
              step="1"
              value={form.softDrink}
              onChange={handleChange}
              disabled={isRefill}
              className={inputClass}
            />
          </label>
        </fieldset>

        <label className="mb-2 block">
          <span className={labelClass}>บัตรส่วนลด</span>
          <select
            name="discount"
            value={form.discount}
            onChange={handleChange}
            className={inputClass}
          >
            {DISCOUNTS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <p className="mb-4 text-[0.78rem] text-gray-500">
          ลดเฉพาะค่าอาหารทั้งหมด ไม่รวมเครื่องดื่ม
        </p>

        {error && (
          <p
            role="alert"
            className="mb-3.5 rounded-lg bg-red-100 px-3 py-2.5 text-[0.85rem] text-red-700"
          >
            {error}
          </p>
        )}

        <div className="mb-[18px] flex gap-3.5">
          <button
            type="button"
            onClick={handleCalculate}
            className="h-[46px] flex-1 cursor-pointer rounded-lg bg-indigo-600 font-semibold text-white hover:brightness-110 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            คำนวณ
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="h-[46px] flex-1 cursor-pointer rounded-lg bg-red-500 font-semibold text-white hover:brightness-110 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            รีเซ็ต
          </button>
        </div>

        <div className="rounded-[10px] bg-indigo-50 p-4 text-center text-[0.95rem]">
          ยอดชำระทั้งหมด:{" "}
          <strong className="text-[1.1rem] text-indigo-600">{formatBaht(total)}</strong> บาท
        </div>
      </div>
    </div>
  );
}