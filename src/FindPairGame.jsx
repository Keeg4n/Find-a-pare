import { useState, useEffect } from 'react';

const FindThePairGame = () => {
  const tileColors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
    'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-orange-400',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Заголовок и статистика */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Найди пару</h1>
          <div className="flex justify-center gap-12 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{moves}</div>
              <div className="text-gray-600 text-sm">Ходов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {matchedTiles.length / 2} / {tileColors.length}
              </div>
              <div className="text-gray-600 text-sm">Найдено пар</div>
            </div>
          </div>
          <button
            onClick={initializeGame}
            className="bg-blue-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-600 active:scale-95 transition-all shadow-lg"
          >
            Новая игра
          </button>
        </div>
        
        {/* Игровое поле */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="grid grid-cols-4 gap-4">
            {tiles.map((tile) => {
              const isFlipped = tile.isFlipped;
              const isMatched = matchedTiles.includes(tile.id);
              const isClickable = !isProcessing && !isMatched && flippedTiles.length < 2;

              return (
                <div
                  key={tile.id}
                  className={`
                    aspect-square rounded-xl
                    transition-all duration-300
                    ${isClickable ? 'cursor-pointer hover:scale-105 hover:shadow-md' : 'cursor-default'}
                    ${isMatched ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}
                    shadow-sm border-2
                    ${isFlipped 
                      ? `${tile.color} border-white shadow-md` 
                      : 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300 hover:from-gray-300 hover:to-gray-400'
                    }
                    flex items-center justify-center
                    text-white font-bold
                  `}
                  onClick={() => isClickable && handleTileClick(tile)}
                >
                  {!isFlipped && !isMatched && (
                    <div className=" from-gray-400 to-gray-500 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Сообщение о победе */}
        {gameWon && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white text-gray-800 p-8 rounded-2xl text-center max-w-sm w-full border border-gray-200 shadow-2xl">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Победа!</h2>
              <p className="text-lg mb-2 text-gray-600">Все пары найдены!</p>
              <p className="text-lg mb-6 text-gray-700">Ходов: <span className="font-bold text-gray-900">{moves}</span></p>
              <button
                onClick={initializeGame}
                className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-600 active:scale-95 transition-all shadow-lg"
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