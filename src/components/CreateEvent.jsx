import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [dates, setDates] = useState(['']);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeInput, setTimeInput] = useState(() => {
    // ローカルストレージから前回の時間設定を取得
    const savedTime = localStorage.getItem('lastTimeInput');
    return savedTime || '19:00～';
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState('');

  // 時間入力が変更されたときにローカルストレージに保存
  useEffect(() => {
    localStorage.setItem('lastTimeInput', timeInput);
  }, [timeInput]);

  const handleAddDate = () => {
    if (selectedDate && timeInput) {
      const formattedDate = `${selectedDate} ${timeInput}`;
      setDates([...dates, formattedDate]);
      setSelectedDate('');
      // 時間はリセットせず、前回の設定を維持
    } else {
      setError('日付と時間を入力してください');
    }
  };

  const handleDateChange = (index, value) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };

  const handleTimeChange = (value) => {
    setTimeInput(value);
  };

  // カレンダーは常に表示するため、トグル関数は不要

  const handleDateSelect = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}/${month}/${day}`;
    setSelectedDate(formattedDate);
    
    // 日付を選択したら自動的に候補リストに追加
    const formattedDateWithTime = `${formattedDate} ${timeInput}`;
    setDates([...dates, formattedDateWithTime]);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // 月の最初の日と最後の日を取得
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 月の最初の日の曜日（0: 日曜日, 1: 月曜日, ...）
    const firstDayOfWeek = firstDay.getDay();
    
    // カレンダーの行を作成
    const calendar = [];
    const daysInMonth = lastDay.getDate();
    
    // 曜日の配列
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    
    // 曜日の行を追加
    calendar.push(
      <tr key="weekdays">
        {weekdays.map((day, index) => (
          <th key={index}>{day}</th>
        ))}
      </tr>
    );
    
    // 日付の行を作成
    let day = 1;
    for (let i = 0; i < 6; i++) {
      if (day > daysInMonth) break;
      
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfWeek) || day > daysInMonth) {
          week.push(<td key={j}></td>);
        } else {
          const date = new Date(year, month, day);
          const isToday = new Date().toDateString() === date.toDateString();
          week.push(
            <td 
              key={j} 
              onClick={() => handleDateSelect(date)}
              className={isToday ? 'today' : ''}
              style={{ cursor: 'pointer' }}
            >
              {day}
            </td>
          );
          day++;
        }
      }
      calendar.push(<tr key={i}>{week}</tr>);
    }
    
    return calendar;
  };

  const handleRemoveDate = (index) => {
    if (dates.length > 1) {
      const newDates = [...dates];
      newDates.splice(index, 1);
      setDates(newDates);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // バリデーション
    if (!eventName.trim()) {
      setError('イベント名を入力してください');
      return;
    }
    
    if (dates.filter(date => date.trim()).length === 0) {
      setError('少なくとも1つの候補日を入力してください');
      return;
    }
    
    // フィルタリングして空の日付を削除
    const validDates = dates.filter(date => date.trim());
    
    // イベントデータの作成
    const eventId = uuidv4();
    const eventData = {
      id: eventId,
      name: eventName,
      description: eventDescription,
      dates: validDates,
      participants: [],
      createdAt: new Date().toISOString()
    };
    
    // ローカルストレージに保存
    const events = JSON.parse(localStorage.getItem('events') || '{}');
    events[eventId] = eventData;
    localStorage.setItem('events', JSON.stringify(events));
    
    // イベントページへリダイレクト
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="create-event-container">
      <div className="event-header">
        <h2>新しいイベントを作成</h2>
        <Link to="/" className="home-button">ホームに戻る</Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="eventName">イベント名 *</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="例: チーム会議"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="eventDescription">イベントの説明</label>
          <textarea
            id="eventDescription"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="例: 四半期の計画について話し合います"
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label>候補日 *</label>
          
          <div className="step-container">
            <div className="step">
              <span className="step-title">STEP1 イベント名</span>
              <span className="step-description">イベントの名前と説明を入力してください</span>
            </div>
            <div className="step">
              <span className="step-title">STEP2 日程候補</span>
              <span className="step-description">候補となる日程を選択してください</span>
            </div>
            <div className="add-time-checkbox">
              <input 
                type="checkbox" 
                id="addTimeCheckbox" 
                checked={true} 
                readOnly 
              />
              <label htmlFor="addTimeCheckbox">日付の後に時刻を追加する</label>
            </div>
          </div>
          
          <div className="calendar-container">
            <div className="date-selection">
              <div className="time-input">
                <label htmlFor="timeInput">時間設定:</label>
                <input
                  id="timeInput"
                  type="text"
                  value={timeInput}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  placeholder="19:00～"
                />
              </div>
            </div>
            
            <div className="calendar-display">
              <div className="calendar-header">
                <button type="button" onClick={handlePrevMonth}>&lt;</button>
                <h3>{currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月</h3>
                <button type="button" onClick={handleNextMonth}>&gt;</button>
              </div>
              <table className="calendar">
                <tbody>
                  {renderCalendar()}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="selected-dates">
            <p>候補の区切りは改行で判断されます。<br />内容は直接編集できます。</p>
            {dates.filter(date => date.trim()).length > 0 ? (
              dates.filter(date => date.trim()).map((date, index) => (
                <div key={index} className="date-input-group">
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    readOnly={index === 0 && dates.length === 1 && !date.trim()}
                  />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveDate(index)}
                    className="remove-date-btn"
                    disabled={dates.length === 1 && !dates[0].trim()}
                  >
                    削除
                  </button>
                </div>
              ))
            ) : (
              <p>日程候補はまだありません。カレンダーから日付を選択してください。</p>
            )}
          </div>
        </div>
        
        <button type="submit" className="submit-btn">イベントを作成</button>
      </form>
    </div>
  );
};

export default CreateEvent;