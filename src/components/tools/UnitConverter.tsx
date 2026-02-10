"use client";

import { useState } from "react";
import { ArrowLeftRight, Ruler } from "lucide-react";

type Unit = "mm" | "cm" | "in" | "ft";

const RATES: Record<Unit, number> = {
    mm: 1,
    cm: 10,
    in: 25.4,
    ft: 304.8,
};

export function UnitConverter() {
    const [amount, setAmount] = useState<number | "">("");
    const [fromUnit, setFromUnit] = useState<Unit>("cm");
    const [toUnit, setToUnit] = useState<Unit>("in");

    const convert = (val: number | "") => {
        if (val === "") return "";
        const mmValue = val * RATES[fromUnit];
        return (mmValue / RATES[toUnit]).toFixed(4);
    };

    const result = convert(amount);

    return (
        <div className="bg-white/60 backdrop-blur border border-peach-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-peach-100 rounded-lg text-peach-500">
                    <Ruler className="size-5" />
                </div>
                <h3 className="text-peach-800 font-bold">Conversor de Unidades</h3>
            </div>

            <div className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-peach-200 focus:outline-none focus:ring-2 focus:ring-peach-300"
                        placeholder="0"
                    />
                    <select
                        value={fromUnit}
                        onChange={(e) => setFromUnit(e.target.value as Unit)}
                        className="bg-white border border-peach-200 rounded-lg px-2 text-peach-800 font-medium focus:outline-none"
                    >
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="in">in</option>
                        <option value="ft">ft</option>
                    </select>
                </div>

                <div className="flex justify-center text-peach-400">
                    <ArrowLeftRight className="size-4" />
                </div>

                <div className="flex gap-2">
                    <div className="w-full px-3 py-2 bg-peach-50 rounded-lg border border-peach-100 text-peach-900 font-bold flex items-center">
                        {result || "0"}
                    </div>
                    <select
                        value={toUnit}
                        onChange={(e) => setToUnit(e.target.value as Unit)}
                        className="bg-white border border-peach-200 rounded-lg px-2 text-peach-800 font-medium focus:outline-none"
                    >
                        <option value="mm">mm</option>
                        <option value="cm">cm</option>
                        <option value="in">in</option>
                        <option value="ft">ft</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
