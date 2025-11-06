import { useState, useEffect } from 'react';

const FindThePairGame = () => {
  const tileColors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500',
  ];

  const [tiles, setTiles] = useState([]);
  const [flippedTiles, setFlippedTiles] = useState([]);
  const [matchedTiles, setMatchedTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Инициализация игры
  const initializeGame = () => {
    const pairs = [...tileColors, ...tileColors];
    const shuffled = pairs
      .sort(() => Math.random() - 0.5)
      .map((color, index) => ({
        id: index,
        color,
        isFlipped: false,
      }));
    
    setTiles(shuffled);
    setFlippedTiles([]);
    setMatchedTiles([]);
    setMoves(0);
    setGameWon(false);
    setIsProcessing(false);
  };

  // Проверка на победу
  useEffect(() => {
    if (matchedTiles.length === tileColors.length * 2) {
      setGameWon(true);
    }
  }, [matchedTiles.length]);

  // Обработка клика по плитке
  const handleTileClick = (clickedTile) => {
    if (isProcessing || clickedTile.isFlipped || matchedTiles.includes(clickedTile.id) || flippedTiles.length === 2) {
      return;
    }

    // Сразу обновляем состояние
    const newTiles = tiles.map(tile =>
      tile.id === clickedTile.id ? { ...tile, isFlipped: true } : tile
    );
    setTiles(newTiles);

    const newFlipped = [...flippedTiles, clickedTile.id];
    setFlippedTiles(newFlipped);

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      setMoves(moves + 1);

      setTimeout(() => {
        const firstTile = newTiles.find(tile => tile.id === newFlipped[0]);
        const secondTile = newTiles.find(tile => tile.id === newFlipped[1]);

        if (firstTile.color === secondTile.color) {
          setMatchedTiles(prev => [...prev, firstTile.id, secondTile.id]);
          setFlippedTiles([]);
          setIsProcessing(false);
        } else {
          setTiles(prevTiles =>
            prevTiles.map(tile =>
              newFlipped.includes(tile.id) ? { ...tile, isFlipped: false } : tile
            )
          );
          setFlippedTiles([]);
          setIsProcessing(false);
        }
      }, 600);
    }
  };

  // Запуск игры при загрузке
  useEffect(() => {
   initializeGame();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Заголовок и статистика */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Найди пару</h1>
          <div className="flex justify-center gap-12 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{moves}</div>
              <div className="text-slate-300 text-sm">Ходов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {matchedTiles.length / 2} / {tileColors.length}
              </div>
              <div className="text-slate-300 text-sm">Найдено пар</div>
            </div>
          </div>
          <button
            onClick={initializeGame}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all shadow-lg"
          >
            Новая игра
          </button>
        </div>
        
        {/* Игровое поле */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="grid grid-cols-4 gap-4">
            {tiles.map((tile) => {
              const isFlipped = tile.isFlipped;
              const isMatched = matchedTiles.includes(tile.id);
              const isClickable = !isProcessing && !isMatched && flippedTiles.length < 2;

              return (
                <div
                  key={tile.id}
                  className={`
                    aspect-square rounded-2xl
                    transition-all duration-300
                    ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                    ${isMatched ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}
                    shadow-lg border-2
                    ${isFlipped 
                      ? `${tile.color} border-white/50` 
                      : 'bg-gradient-to-br from-slate-600 to-slate-800 border-slate-500/30 hover:from-slate-500 hover:to-slate-700'
                    }
                    flex items-center justify-center
                    text-white font-bold text-xl
                  `}
                  onClick={() => isClickable && handleTileClick(tile)}
                >
                  {!isFlipped && !isMatched && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-80" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Сообщение о победе */}
        {gameWon && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 text-white p-8 rounded-2xl text-center max-w-sm w-full border border-white/20 shadow-2xl">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-2">Победа!</h2>
              <p className="text-lg mb-2">Все пары найдены!</p>
              <p className="text-lg mb-6">Ходов: <span className="font-bold">{moves}</span></p>
              <button
                onClick={initializeGame}
                className="bg-white text-green-700 px-8 py-3 rounded-xl font-bold text-lg hover:bg-slate-100 active:scale-95 transition-all shadow-lg"
              >
                Играть снова
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindThePairGame;