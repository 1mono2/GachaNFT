import React, { useState } from "react";
import "./Apps.css";
import Deposit from "../Deposit/index";
import Withdraw from "../Withdraw";
import Gacha from "../Gacha";

const Apps = () => {
    // 現在の表示コンポーネントを管理するための状態
    const [currentView, setCurrentView] = useState("deposit");

    // 適切なコンポーネントをレンダリングする関数
    const renderContent = () => {
        switch (currentView) {
            case "deposit":
                return <Deposit />;
            case "withdraw":
                return <Withdraw />;
            case "gacha":
                return <Gacha />;
            default:
                return <Gacha />;
        }
    };

    return (
        // ボタンを二つ並べる
        <div className="apps-container">
            <div className="header-container"></div>
            <div className="button-container">
                <button
                    className="deposit-button apps-button"
                    onClick={() => setCurrentView("deposit")}
                >
                    <span>Deposit</span>
                </button>
                <button
                    className="withdraw-button apps-button"
                    onClick={() => setCurrentView("withdraw")}
                >
                    <span>Withdraw</span>
                </button>
                <button
                    className="gacha-button apps-button"
                    onClick={() => setCurrentView("gacha")}
                >
                    <span>Gacha</span>
                </button>
            </div>
            {renderContent()}
        </div>
    );
};
export default Apps;
