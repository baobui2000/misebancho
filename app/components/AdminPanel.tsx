"use client";

import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [pendingSubmissions, setPendingSubmissions] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "add") {
        setPendingSubmissions((prev) => [...prev, data.name]);
      } else if (data.type === "remove") {
        setPendingSubmissions((prev) =>
          prev.filter((name) => name !== data.name)
        );
      } else if (data.type === "clear") {
        setPendingSubmissions([]);
      }
    };

    fetch("/api/submissions")
      .then((response) => response.json())
      .then((data) => {
        setPendingSubmissions(data);
        setIsLoading(false);
      });

    return () => {
      eventSource.close();
    };
  }, []);

  const handleAddName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", name: newName.trim() }),
      });
      setNewName("");
    }
  };

  const handleClearList = async () => {
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // This is a mock search. In a real application, you'd query a database or API.
    const mockNames = [
      "秋澤 麻里",
      "ブイ クオック バオ",
      "ル ホアン ロン",
      "グエン タイン リエム",
      "チョウ ジン ウィン",
      "ブイ ウェン キエン",
      "佐藤 智子",
      "新開 彩菜",
      "進藤 飛鳥",
      "井上 峻佑",
      "永迫 佳予子",
      "栗林 義隆",
      "瀧 遥翔",
      "堀 聖欣",
      "グエン ディン サン",
      "松元 浩",
      "田村 聖泰",
      "ルオン ティ ドアン",
      "ブイ トゥオン ホアイ",
      "グエン ウェン ナム",
      "ファム ティ ジェム スオン",
      "チャン イエン キー",
      "クムタダラ チョー",
      "ミャー ス ナイン",
      "プー プイン テー カイン",
      "ギェム トー ブン",
      "グルン アサ",
      "グルン プリニマ",
      "グエン バ ナム",
      "ソー",
      "宮北 芳美",
      "高橋 将大",
      "小松 舞夢",
      "ナイン トー",
      "金成 蓮",
      "古戸 樹",
      "グエン ティ マイ",
      "タマンゴナニ",
      "チェウ ティ リン",
      "チャン タイン ロック",
      "アカシュ",
      "ホ ティ チック クイン",
      "アクテル アキ",
      "バタン カシジ ザキアアクタル",
      "エランダ",
      "グエン ティ リン",
      "ウーマン トウエン",
      "チャン ゴック ジェム",
      "ヒョーネー トウエ",
      "チャウ ゴク ホアン イエン",
      "スー タジン アウン",
      "ニン イー イー ニェー",
      "タン ダー ミョー",
      "ナン ザ チー ウー",
      "宮田 麗",
      "小濱 颯太",
      "ヴィシュミ",
      "ネシュミ",
      "ビケ アルパン",
      "ルー リーシャ",
      "グエン ゴック アン",
      "グエンティフェン",
      "グエン ティ アン トウ",
      "チャン ブ キエウ アイン",
      "ジャスミン アンシェラ ハンキ",
      "ホアン トウエット ニン",
      "チン フォン オアン",
      "チャン ティ ヒエン",
      "ファム テイ フォン",
      "ファムティ トウエット ニン",
      "パウデルザナク",
      "荻野 寿子",
      "甲斐 美由紀",
      "齋藤 正美",
      "山瀬 遡太朗",
      "余井 媛香",
      "野原 悠",
      "五浦 こころ",
      "津野 未咲",
      "大西 成吾",
      "西川 史哲",
      "大川 洵",
      "中津 元",
      "星本 源悟",
      "内田 啓太",
      "川名 勇樹",
      "ムンフェルデネ ツォルモン",
      "張 文馨",
      "和智 龍信",
      "江 佳芬",
    ];
    setSearchResults(
      mockNames.filter(
        (name) =>
          name.toLowerCase().includes(term.toLowerCase()) &&
          !pendingSubmissions.includes(name)
      )
    );
  };

  const handleAddFromSearch = async (name: string) => {
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", name }),
    });
    setSearchResults((prev) => prev.filter((n) => n !== name));
  };

  const handleDeleteName = async (name: string) => {
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove", name }),
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search names..."
          className="w-full p-2 border rounded"
        />
      </div>
      {searchResults.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">検索結果</h2>
          <ul className="space-y-2">
            {searchResults.map((name) => (
              <li
                key={name}
                className="flex items-center justify-between bg-white p-3 rounded shadow"
              >
                <span>{name}</span>
                <button
                  onClick={() => handleAddFromSearch(name)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  リスト追加
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleAddName} className="mb-4">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="お名前を入力"
          className="border p-2 mr-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          追加
        </button>
      </form>
      <button
        onClick={handleClearList}
        className="bg-red-500 text-white px-4 py-2 rounded mb-4"
      >
        リスト取り消し
      </button>
      <h2 className="text-xl font-bold mt-4 mb-2">
        Current Pending Submissions
      </h2>
      <ul className="space-y-2">
        {pendingSubmissions.map((name) => (
          <li
            key={name}
            className="flex items-center justify-between bg-white p-3 rounded shadow"
          >
            <span>{name}</span>
            <button
              onClick={() => handleDeleteName(name)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              取消
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
