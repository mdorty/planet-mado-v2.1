export function BattleUI() {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl">Battle Arena</h2>
        <p>Choose your move!</p>
        <div className="flex space-x-2">
          <button className="bg-dbz-blue text-white px-4 py-2 rounded">
            Punch
          </button>
          <button className="bg-dbz-blue text-white px-4 py-2 rounded">
            Ki Blast
          </button>
        </div>
      </div>
    );
  }