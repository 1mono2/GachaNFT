import "./Apps.css";
import Deposit from "../Deposit";
import Withdraw from "../Withdraw";
import Gacha from "../Gacha";

// フロントエンドにNFTキャラクターを表示するため、characterNFTのメタデータを渡します。
const Apps = () => {

    const RenderDepositContent = () => {
        return (<Deposit />);
    }

    const RenderWithdrawContent = () => {
        return (<Withdraw />);
    }

    const RenderGachaContent = () => {
        return (<Gacha />);
    }

    return (
        // ボタンを二つ並べる
        <div className="apps-container">
            <div className="header-container">
            </div>
            <div className="button-container">
                <button className="deposit-button apps-button" onClick={RenderDepositContent}>
                    <span>Deposit</span>
                </button>
                <button className="withdraw-button apps-button" onClick={RenderWithdrawContent}>
                    <span>Withdraw</span>
                </button>
                <button className="gacha-button apps-button" onClick={RenderGachaContent}>
                    <span>Gacha</span>
                </button>
            </div>

        </div>
    );
};
export default Apps;