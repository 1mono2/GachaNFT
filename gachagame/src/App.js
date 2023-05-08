import twitterLogo from './Assets/twitter-logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import ethers from 'ethers';
//import Moralis from 'moralis';
import { CONTRACT_ADDRESS, SEPOLIA_NETWORK, transformCharacterData } from './constant';
import gachaNFT from './Utils/GachaNFT.json';
import Apps from './Components/Apps';

const TWITTER_HANDLE = '1MoNo2Prod';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
  const [currentAccount, setCurrentAccount] = useState(null);


  // ユーザーがSepolia Network に接続されているか確認します。
  // '11155111' は Sepolia のネットワークコードです。
  const checkNetwork = async () => {
    try {
      if (window.ethereum.networkVersion !== SEPOLIA_NETWORK) {
        alert('このゲームはSepolia Networkに接続されている必要があります。');
      } else {
        console.log('Sepolia Networkに接続されています。');
      }
    } catch (error) {
      console.log(error);
    }
  }

  // ユーザーがMetaMaskを持っているか確認します。
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log('MetaMaskが見つかりませんでした。');
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
        // accountsにWEBサイトを訪れたユーザーのウォレットアカウントを格納します。
        // （複数持っている場合も加味、よって account's' と変数を定義している）
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          // ユーザーのウォレットアドレスを状態変数に格納します。
          setCurrentAccount(account);
        } else {
          console.log("No authorized account found");
        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  // レンダリングメソッド
  const renderContent = () => {

    // シナリオ1.
    // ユーザーがWEBアプリにログインしていない場合、WEBアプリ上に、"Connect Wallet to Get Started" ボタンを表示します。
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img src="https://1.bp.blogspot.com/-sZbaFXJ4y0A/UnyGKAJjwbI/AAAAAAAAacE/RYDWRq73Hsc/s400/gachagacha.png" alt="LUFFY" />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet to Get Started
          </button>
        </div>
      );
      // シナリオ2.
      // ユーザーはWEBアプリにログインしている
    } else {
      return (<Apps />);
    }
  };

  // ユーザーがウォレットに接続するための関数を定義します。
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert('MetaMaskが見つかりませんでした。');
        return;
      }
      // ユーザーがウォレットを持っているか確認します。
      checkIfWalletIsConnected();


      // ユーザーにウォレットに接続するように求めます。
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Connected', accounts[0]);
      // ユーザーのウォレットアドレスを状態変数に格納します。
      setCurrentAccount(accounts[0]);

      // ユーザーがSepolia Network に接続されているか確認します。
      checkNetwork();

    } catch (error) {
      console.log(error);
    }
  }

  // ページがロードされたときに useEffect()内の関数が呼び出されます。
  useEffect(() => {

    // 接続されたウォレットがある場合のみ、下記を実行します。
    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
    }
  }, [currentAccount]);

  useEffect(() => {
    //checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🚀 GACHA GAME 🚀</p>
          <div className="connect-wallet-container">
            {/* renderContent メソッドを呼び出します。*/}
            {renderContent()}
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};
export default App;
