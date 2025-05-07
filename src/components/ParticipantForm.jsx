import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ParticipantForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    // ローカルストレージからイベントデータを取得
    try {
      const events = JSON.parse(localStorage.getItem('events') || '{}');
      const eventData = events[eventId];
      
      if (eventData) {
        setEvent(eventData);
        // 候補日の数に合わせて可用性の配列を初期化
        setAvailability(new Array(eventData.dates.length).fill('unavailable'));
      } else {
        setError('イベントが見つかりませんでした');
      }
    } catch (err) {
      setError('データの読み込み中にエラーが発生しました');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const handleAvailabilityChange = (index, value) => {
    const newAvailability = [...availability];
    newAvailability[index] = value;
    setAvailability(newAvailability);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // バリデーション
    if (!name.trim()) {
      setError('名前を入力してください');
      return;
    }
    
    // 参加者データの作成
    const participantData = {
      name,
      comment,
      availability,
      submittedAt: new Date().toISOString()
    };
    
    // ローカルストレージからイベントデータを取得して更新
    try {
      const events = JSON.parse(localStorage.getItem('events') || '{}');
      const eventData = events[eventId];
      
      if (eventData) {
        // 参加者を追加
        eventData.participants.push(participantData);
        events[eventId] = eventData;
        localStorage.setItem('events', JSON.stringify(events));
        
        // イベントページへリダイレクト
        navigate(`/event/${eventId}`);
      } else {
        setError('イベントが見つかりませんでした');
      }
    } catch (err) {
      setError('データの保存中にエラーが発生しました');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!event) {
    return <div className="not-found">イベントが見つかりませんでした</div>;
  }

  return (
    <div className="participant-form-container">
      <h2>{event.name}への参加登録</h2>
      {event.description && <p className="event-description">{event.description}</p>}
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="participant-form">
        <div className="form-group">
          <label htmlFor="name">お名前 *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 山田太郎"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="comment">コメント</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="例: 遅れて参加する可能性があります"
            rows="2"
          />
        </div>
        
        <div className="form-group">
          <label>候補日の都合</label>
          <div className="dates-availability">
            {event.dates.map((date, index) => (
              <div key={index} className="date-availability-item">
                <p className="date-label">
                  {(() => {
                    // 日付文字列を適切にパースする
                    const dateParts = date.split(' ')[0].split('/');
                    const timeInfo = date.split(' ')[1] || '';
                    return dateParts.length === 3 ? 
                      `${dateParts[0]}年${dateParts[1]}月${dateParts[2]}日 ${timeInfo}` : 
                      date;
                  })()}
                </p>
                <div className="availability-options">
                  <div className="option-buttons">
                    <button
                      type="button"
                      className={`option-btn available ${availability[index] === 'available' ? 'selected' : ''}`}
                      onClick={() => handleAvailabilityChange(index, 'available')}
                    >
                      ○
                    </button>
                    <button
                      type="button"
                      className={`option-btn maybe ${availability[index] === 'maybe' ? 'selected' : ''}`}
                      onClick={() => handleAvailabilityChange(index, 'maybe')}
                    >
                      △
                    </button>
                    <button
                      type="button"
                      className={`option-btn unavailable ${availability[index] === 'unavailable' ? 'selected' : ''}`}
                      onClick={() => handleAvailabilityChange(index, 'unavailable')}
                    >
                      ×
                    </button>
                  </div>
                  <div className="option-labels">
                    <span className="option-label">○（参加可能）</span>
                    <span className="option-label">△（未定・要相談）</span>
                    <span className="option-label">×（参加不可）</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <button type="submit" className="submit-btn">回答を送信</button>
      </form>
    </div>
  );
};

export default ParticipantForm;