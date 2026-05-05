import React, { useState, useEffect } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";

export default function FinancialChart() {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Data fetch korar jonno useEffect use kora uchit
        fetch("/aquamate36.json")
            .then(res => res.json())
            .then(data => {
                const formattedData = parse(data);
                setChartData(formattedData);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading data:", err);
                setLoading(false);
            });
    }, []);

    // String values like "180K" ke number-e convert korar function
    const parse = (d) => {
        const toNum = (s) => {
            if (typeof s === 'number') return s;
            return Number(String(s).replace(/[^0-9.-]+/g, ""));
        };

        return d.map(r => ({
            month: r.month,
            deviceRevenue: toNum(r.device_revenue),
            subscriptionRevenue: toNum(r.subscription_revenue),
            netAfterCogs: toNum(r.net_profit_after_cogs)
        }));
    };

    if (loading) return <div>Loading Chart...</div>;

    return (
        <div style={{ width: '100%', height: 400, background: '#fff', padding: '20px', borderRadius: '8px' }}>
            <h2 style={{ textAlign: "center" }}>Aqua Mate Financial</h2>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="month"
                        label={{ value: "Month", position: "insideBottom", offset: -10 }}
                    />
                    <YAxis
                        label={{ value: "Amount (K BDT)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip formatter={(value) => `${value}K BDT`} />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="deviceRevenue" stroke="#1f77b4" name="Device Revenue" strokeWidth={2} />
                    <Line type="monotone" dataKey="subscriptionRevenue" stroke="#2ca02c" name="Subscription Revenue" strokeWidth={2} />
                    <Line type="monotone" dataKey="netAfterCogs" stroke="#ff7f0e" name="Net After COGS" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}