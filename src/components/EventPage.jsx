import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // ローカルストレージからイベントデータを取得
    const fetchEvent = () => {
      try {
        const events = JSON.parse(localStorage.getItem('events') || '{}');
        const eventData = events[eventId];
        
        if (eventData) {
          setEvent(eventData);
        } else {
          setError('イベントが見つかりませんでした');
        }
      } catch (err) {
        setError('データの読み込み中にエラーが発生しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

    // ローカルストレージの変更を監視
    const handleStorageChange = () => {
      fetchEvent();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [eventId]);

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!event) {
    return <div className="not-found">イベントが見つかりませんでした</div>;
  }

  // 参加URLをコピーする関数
  const copyParticipateUrl = () => {
    const url = `${window.location.origin}/event/${eventId}/participate`;
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('参加用URLがクリップボードにコピーされました');
      })
      .catch(err => {
        console.error('URLのコピーに失敗しました:', err);
      });
  };

  return (
    <div className="event-page-container">
      <h2>{event.name}</h2>
      {event.description && <p className="event-description">{event.description}</p>}
      
      <div className="event-actions">
        <Link to={`/event/${eventId}/participate`} className="participate-btn">
          このイベントに参加する
        </Link>
        <button onClick={copyParticipateUrl} className="copy-url-btn">
          参加用URLをコピー
        </button>
      </div>
      
      <div className="event-dates-container">
        <h3>候補日と参加者の回答</h3>
        
        {event.participants.length === 0 ? (
          <p>まだ参加者はいません。</p>
        ) : (
          <div className="availability-table-container">
            <table className="availability-table">
              <thead>
                <tr>
                  <th>参加者</th>
                  {event.dates.map((date, index) => {
                    // 日付文字列を適切にパースする
                    const dateParts = date.split(' ')[0].split('/');
                    const timeInfo = date.split(' ')[1] || '';
                    const formattedDate = dateParts.length === 3 ? 
                      `${dateParts[0]}年${dateParts[1]}月${dateParts[2]}日 ${timeInfo}` : 
                      date;
                    return <th key={index}>{formattedDate}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {event.participants.map((participant, index) => (
                  <tr key={index}>
                    <td>{participant.name}</td>
                    {event.dates.map((date, dateIndex) => {
                      const availability = participant.availability[dateIndex];
                      let availabilityClass = '';
                      let availabilityText = '';
                      
                      if (availability === 'available') {
                        availabilityClass = 'available';
                        availabilityText = '○';
                      } else if (availability === 'maybe') {
                        availabilityClass = 'maybe';
                        availabilityText = '△';
                      } else {
                        availabilityClass = 'unavailable';
                        availabilityText = '×';
                      }
                      
                      return (
                        <td key={dateIndex} className={availabilityClass}>
                          {availabilityText}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {event.participants.length > 0 && (
                  <tr className="summary-row">
                    <td>集計</td>
                    {event.dates.map((date, dateIndex) => {
                      const availableCount = event.participants.filter(
                        p => p.availability[dateIndex] === 'available'
                      ).length;
                      const maybeCount = event.participants.filter(
                        p => p.availability[dateIndex] === 'maybe'
                      ).length;
                      const unavailableCount = event.participants.filter(
                        p => p.availability[dateIndex] === 'unavailable'
                      ).length;
                      
                      return (
                        <td key={dateIndex} className="summary-cell">
                          <div className="count-item available">{availableCount}人</div>
                          <div className="count-item maybe">{maybeCount}人</div>
                          <div className="count-item unavailable">{unavailableCount}人</div>
                        </td>
                      );
                    })}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPage;