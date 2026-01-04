
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PostCategory, GalleryPost, GalleryComment, UserStats } from '../types';
import { 
  Plus, Search, MessageSquare, Heart, 
  Image as ImageIcon, MoreHorizontal, Send, 
  X, Filter, CheckCircle2, ChevronRight, Share2, Sparkles
} from 'lucide-react';

interface GalleryViewProps {
  stats: UserStats;
  onPostCreated: (xp: number) => void;
}

const INITIAL_POSTS: GalleryPost[] = [
  {
    id: '1',
    category: '과제제출',
    title: '현대자동차 10월 판매 실적 대시보드 제출합니다.',
    content: '현대자동차 실무 지표를 활용하여 지역별/차종별 트렌드를 분석했습니다. 전반적으로 GMV 상승세가 뚜렷하네요.',
    author: '홍길동',
    authorNickname: '태블로장인민수',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bbbda5366a7a?auto=format&fit=crop&q=80&w=800',
    createdAt: '2시간 전',
    likes: 24,
    comments: [
      { id: 'c1', author: '데이터왕', content: '색상 팔레트가 아주 깔끔하네요!', createdAt: '1시간 전' }
    ]
  },
  {
    id: '2',
    category: '대시보드',
    title: '나만의 개인 자산 관리 대시보드 공유!',
    content: '가계부 데이터를 태블로로 연결해봤습니다. 카테고리별 지출 현황이 한눈에 들어와서 좋네요.',
    author: '김철수',
    authorNickname: '데이터러버',
    imageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&q=80&w=800',
    createdAt: '5시간 전',
    likes: 12,
    comments: []
  }
];

const GalleryView: React.FC<GalleryViewProps> = ({ stats, onPostCreated }) => {
  const [posts, setPosts] = useState<GalleryPost[]>(INITIAL_POSTS);
  const [filter, setFilter] = useState<PostCategory | '전체'>('전체');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PostCategory>('과제제출');
  const [newContent, setNewContent] = useState('');
  const [commentInput, setCommentInput] = useState('');

  const filteredPosts = filter === '전체' ? posts : posts.filter(p => p.category === filter);

  const handleCreatePost = () => {
    if (!newTitle || !newContent) return;
    
    // XP 보상 로직: 과제제출은 30, 나머지는 5
    const xpReward = newCategory === '과제제출' ? 30 : 5;

    const newPost: GalleryPost = {
      id: Date.now().toString(),
      category: newCategory,
      title: newTitle,
      content: newContent,
      author: stats.userName,
      authorNickname: stats.nickname,
      createdAt: '방금 전',
      likes: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
    onPostCreated(xpReward); // 상위 컴포넌트로 XP 전달
    setIsWriteModalOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    const newComment: GalleryComment = {
      id: Date.now().toString(),
      author: stats.nickname,
      content: commentInput,
      createdAt: '방금 전'
    };
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
    setCommentInput('');
  };

  const selectedPost = posts.find(p => p.id === selectedPostId);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-2 font-black text-xs uppercase tracking-widest">
            <Sparkles size={14} /> 커뮤니티 활동으로 XP 획득 가능
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">커뮤니티 갤러리</h1>
          <p className="text-sm text-slate-500 font-bold mt-2">동료들의 대시보드를 구경하고 피드백을 나눠보세요.</p>
        </div>
        <button 
          onClick={() => setIsWriteModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 text-sm active:scale-95"
        >
          <Plus size={20} /> 새 글 작성하기
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['전체', '과제제출', '대시보드', '자유'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-6 py-2.5 rounded-full text-[13px] font-black transition-all border-2 shrink-0 ${
              filter === cat 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredPosts.map((post) => (
            <motion.div
              layout
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setSelectedPostId(post.id)}
              className="bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col shadow-sm"
            >
              {post.imageUrl ? (
                <div className="aspect-video w-full overflow-hidden bg-slate-50">
                  <img src={post.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={post.title} />
                </div>
              ) : (
                <div className="aspect-video w-full bg-slate-50 flex items-center justify-center text-slate-200">
                  <ImageIcon size={48} strokeWidth={1} />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    post.category === '과제제출' ? 'bg-emerald-100 text-emerald-700' : 
                    post.category === '대시보드' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {post.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{post.createdAt}</span>
                </div>
                <h3 className="text-base font-black text-slate-800 leading-tight mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">{post.title}</h3>
                <p className="text-[12px] text-slate-500 font-bold line-clamp-2 leading-relaxed mb-6">{post.content}</p>
                <div className="mt-auto pt-5 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black border border-indigo-100">
                      <span className="text-[10px]">{post.authorNickname.charAt(0)}</span>
                    </div>
                    <span className="text-[12px] font-black text-slate-700">{post.authorNickname}</span>
                  </div>
                  <div className="flex items-center gap-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Heart size={16} />
                      <span className="text-[11px] font-black">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare size={16} />
                      <span className="text-[11px] font-black">{post.comments.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white w-full max-w-xl rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 bg-indigo-600 text-white flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black">새로운 게시글 작성</h2>
                  <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest mt-1">Community Activity Reward</p>
                </div>
                <button onClick={() => setIsWriteModalOpen(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-all"><X size={20} /></button>
              </div>
              <div className="p-10 space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">게시글 분류</label>
                  <div className="flex gap-3">
                    {['과제제출', '대시보드', '자유'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setNewCategory(cat as PostCategory)}
                        className={`flex-1 py-4 rounded-2xl text-[11px] font-black border-2 transition-all ${
                          newCategory === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
                        }`}
                      >
                        {cat} {cat === '과제제출' ? '+30XP' : '+5XP'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="제목을 입력하세요..."
                    className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-black text-lg placeholder:text-slate-300 transition-all shadow-inner"
                  />
                </div>
                <div>
                  <textarea 
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="내용을 자유롭게 작성해주세요..."
                    className="w-full p-5 h-44 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-500 outline-none font-bold text-sm resize-none shadow-inner"
                  />
                </div>
                <button 
                  onClick={handleCreatePost} 
                  disabled={!newTitle || !newContent}
                  className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-30 active:scale-95"
                >
                  게시하고 활동 포인트 받기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedPostId && selectedPost && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[48px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <div className="w-full md:w-1/2 bg-slate-50 flex items-center justify-center border-r border-slate-100">
                {selectedPost.imageUrl ? (
                  <img src={selectedPost.imageUrl} className="w-full h-full object-contain" alt={selectedPost.title} />
                ) : (
                  <div className="text-slate-200 flex flex-col items-center gap-6">
                    <ImageIcon size={80} strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Image Area</p>
                  </div>
                )}
              </div>

              <div className="w-full md:w-1/2 flex flex-col bg-white">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-100">
                      {selectedPost.authorNickname.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{selectedPost.authorNickname}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{selectedPost.createdAt}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPostId(null)} className="p-2.5 hover:bg-slate-50 rounded-2xl transition-all"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-10 space-y-8">
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest mb-3 inline-block ${
                      selectedPost.category === '과제제출' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {selectedPost.category}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight mb-4">{selectedPost.title}</h2>
                    <p className="text-[13px] text-slate-600 font-bold leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <MessageSquare size={14} /> Comments ({selectedPost.comments.length})
                    </h4>
                    <div className="space-y-4">
                      {selectedPost.comments.length === 0 ? (
                        <div className="text-center py-10 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                          <p className="text-[11px] text-slate-400 font-bold">아직 댓글이 없습니다. 첫 마디를 남겨보세요!</p>
                        </div>
                      ) : (
                        selectedPost.comments.map(c => (
                          <div key={c.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-black text-indigo-600">{c.author}</span>
                              <span className="text-[10px] text-slate-400 font-bold">{c.createdAt}</span>
                            </div>
                            <p className="text-[12px] text-slate-700 font-bold">{c.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-8 border-t border-slate-100 bg-slate-50/20">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(selectedPost.id)}
                      placeholder="함께 성장하는 댓글을 남겨보세요..."
                      className="w-full pl-6 pr-14 py-4 bg-white border border-slate-200 rounded-2xl focus:border-indigo-500 outline-none text-[12px] font-bold shadow-sm"
                    />
                    <button 
                      onClick={() => handleAddComment(selectedPost.id)}
                      className="absolute right-2 top-2 bottom-2 w-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryView;
