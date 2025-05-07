import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h2>イベント日程調整アプリへようこそ</h2>
      <p>複数の候補日から参加者が都合の良い日を選べる日程調整サービスです。</p>
      
      <div className="action-buttons">
        <Link to="/create" className="create-button">
          新しいイベントを作成する
        </Link>
      </div>
      
      <div className="features">
        <div className="feature">
          <h3>簡単作成</h3>
          <p>数クリックでイベント日程調整ページを作成できます</p>
        </div>
        <div className="feature">
          <h3>共有が簡単</h3>
          <p>URLを共有するだけで参加者を招待できます</p>
        </div>
        <div className="feature">
          <h3>リアルタイム更新</h3>
          <p>参加者の回答がリアルタイムで反映されます</p>
        </div>
      </div>
    </div>
  );
};

export default Home;