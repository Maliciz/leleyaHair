import React, { useState, useEffect } from 'react';
import {
  instagramApi,
  InstagramPostItem,
  CreateInstagramPostPayload,
} from '../../api/instagramApi';
import { adminApi, MasterItem } from '../../api/adminApi';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Instagram,
  Plus,
  Trash2,
  ExternalLink,
  Heart,
  User,
  Sparkles,
  RefreshCw,
  X,
  Image as ImageIcon,
} from 'lucide-react';

export const InstagramTab: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPostItem[]>([]);
  const [masters, setMasters] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Create Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<CreateInstagramPostPayload>({
    title: '',
    category: 'Чоловічі',
    postUrl: 'https://www.instagram.com/leleya.hair/',
    imageUrl: '',
    masterName: '',
    description: '',
    likesCount: 0,
  });

  useEffect(() => {
    fetchPosts();
    fetchMasters();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await instagramApi.getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching Instagram posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMasters = async () => {
    try {
      const data = await adminApi.getMastersList();
      setMasters(data);
      if (data.length > 0) {
        setFormData((prev) => ({ ...prev, masterName: data[0].name }));
      }
    } catch (err) {
      console.error('Error fetching masters list:', err);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      title: '',
      category: 'Чоловічі',
      postUrl: 'https://www.instagram.com/leleya.hair/',
      imageUrl: '',
      masterName: masters.length > 0 ? masters[0].name : 'Олена',
      description: '',
      likesCount: 25,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.imageUrl) {
      alert('Будь ласка, заповніть назву та URL зображення');
      return;
    }

    setCreating(true);
    try {
      await instagramApi.createPost(formData);
      setIsModalOpen(false);
      await fetchPosts();
    } catch (err: any) {
      console.error('Error creating Instagram post:', err);
      alert(err.message || 'Помилка при створенні допису');
    } finally {
      setCreating(false);
    }
  };

  const handleDeletePost = async (id: string, title: string) => {
    if (!window.confirm(`Ви дійсно бажаєте видалити допис "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await instagramApi.deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error('Error deleting post:', err);
      alert(err.message || 'Помилка при видаленні допису');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Action Header Bar */}
      <div className="bg-dark-900 border border-gold-600/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-500 font-semibold block mb-1">
            Керування контентом
          </span>
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Instagram className="text-pink-500" />
            <span>Публікації Instagram & Галерея</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Керуйте знімками стрижок та фарбувань, що виводяться на головній сторінці салону
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="contained"
            onClick={handleOpenModal}
            startIcon={<Plus />}
            style={{
              backgroundColor: '#C59A77',
              color: '#0C0C0E',
              fontWeight: 'bold',
              borderRadius: '12px',
              padding: '10px 20px',
              textTransform: 'none',
            }}
          >
            Створити публікацію
          </Button>

          <IconButton
            onClick={fetchPosts}
            style={{
              color: '#C59A77',
              border: '1px solid rgba(197, 154, 119, 0.3)',
              borderRadius: '12px',
            }}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </IconButton>
        </div>
      </div>

      {/* Grid of Existing Posts */}
      {loading ? (
        <div className="flex justify-center py-20">
          <CircularProgress style={{ color: '#C59A77' }} size={44} />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-dark-900/60 rounded-2xl border border-gold-600/20">
          <Instagram className="w-12 h-12 text-gold-500/40 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-white mb-1">Публікацій поки немає</h3>
          <p className="text-xs text-gray-400 mb-4">Натисніть кнопку вище, щоб додати першу фотографію роботи</p>
          <Button
            variant="contained"
            onClick={handleOpenModal}
            startIcon={<Plus />}
            style={{
              backgroundColor: '#C59A77',
              color: '#0C0C0E',
              fontWeight: 'bold',
              borderRadius: '10px',
            }}
          >
            Додати допис
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-dark-900 border border-gold-600/20 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-gold-500/50 transition-all duration-300"
            >
              {/* Top Image Preview & Badge */}
              <div className="relative aspect-square w-full overflow-hidden bg-black">
                <img
                  src={post.imageUrl || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format&fit=crop&q=80'}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Badge */}
                <span className="absolute top-3 left-3 bg-dark-950/80 backdrop-blur-md border border-gold-600/30 text-gold-400 text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {post.category}
                </span>

                {/* Likes Count */}
                <span className="absolute top-3 right-3 bg-dark-950/80 backdrop-blur-md border border-rose-500/30 text-rose-400 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-rose-500" />
                  <span>{post.likesCount}</span>
                </span>
              </div>

              {/* Body Content Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-serif font-bold text-white text-base leading-tight mb-1">
                    {post.title}
                  </h4>
                  {post.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-gold-400 font-medium flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Майстер: {post.masterName || 'Не вказано'}</span>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="pt-3 border-t border-gold-600/10 flex items-center justify-between">
                  <a
                    href={post.postUrl || 'https://www.instagram.com/leleya.hair/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => handleDeletePost(post.id, post.title)}
                    disabled={deletingId === post.id}
                    className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/60 transition-colors flex items-center gap-1 text-xs font-semibold"
                    title="Видалити публікацію"
                  >
                    {deletingId === post.id ? (
                      <CircularProgress size={14} color="inherit" />
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Видалити</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE INSTAGRAM POST DIALOG MODAL */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#0C0C0E',
            color: '#FFFFFF',
            border: '1px solid rgba(197, 154, 119, 0.4)',
            borderRadius: '20px',
          },
        }}
      >
        <form onSubmit={handleCreateSubmit}>
          <DialogTitle className="flex items-center justify-between border-b border-gold-600/20 pb-4">
            <span className="font-serif font-bold text-xl text-white flex items-center gap-2">
              <Instagram className="text-pink-500" />
              <span>Нова публікація в Instagram</span>
            </span>
            <IconButton onClick={handleCloseModal} style={{ color: '#9CA3AF' }}>
              <X className="w-5 h-5" />
            </IconButton>
          </DialogTitle>

          <DialogContent className="space-y-4 pt-6">
            
            {/* Title Field */}
            <TextField
              fullWidth
              label="Заголовок публікації *"
              placeholder="наприклад: Fade & Оформлення бороди"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              variant="outlined"
              sx={{
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiFormLabel-root': { color: '#C59A77' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(197, 154, 119, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C59A77' },
              }}
            />

            {/* Category Select */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#C59A77' }}>Категорія *</InputLabel>
              <Select
                value={formData.category}
                label="Категорія *"
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                sx={{
                  color: '#FFFFFF',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(197, 154, 119, 0.3)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C59A77' },
                  '.MuiSvgIcon-root': { color: '#C59A77' },
                }}
              >
                <MenuItem value="Чоловічі">Чоловічі стрижки</MenuItem>
                <MenuItem value="Жіночі">Жіночі стрижки</MenuItem>
                <MenuItem value="Дитячі">Дитячі стрижки</MenuItem>
                <MenuItem value="Фарбування">Фарбування та укладки</MenuItem>
              </Select>
            </FormControl>

            {/* Image URL Field & Live Preview */}
            <TextField
              fullWidth
              label="URL зображення (Image URL) *"
              placeholder="https://images.unsplash.com/... або посилання на фото"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              required
              variant="outlined"
              sx={{
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiFormLabel-root': { color: '#C59A77' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(197, 154, 119, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C59A77' },
              }}
            />

            {/* Live Image Preview Thumbnail */}
            {formData.imageUrl && (
              <div className="flex items-center gap-3 p-3 bg-dark-950 rounded-xl border border-gold-600/20">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg border border-gold-600/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                  }}
                />
                <div className="text-xs text-gray-300">
                  <span className="font-bold text-gold-400 block mb-0.5">Попередній перегляд:</span>
                  <span>Зображення завантажиться при публікації</span>
                </div>
              </div>
            )}

            {/* Instagram Post Direct Link */}
            <TextField
              fullWidth
              label="Посилання на допис в Instagram"
              placeholder="https://www.instagram.com/p/..."
              value={formData.postUrl}
              onChange={(e) => setFormData({ ...formData, postUrl: e.target.value })}
              variant="outlined"
              sx={{
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiFormLabel-root': { color: '#C59A77' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(197, 154, 119, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C59A77' },
              }}
            />

            {/* Master Select / Name Input */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#C59A77' }}>Виконавчий майстер</InputLabel>
              <Select
                value={formData.masterName}
                label="Виконавчий майстер"
                onChange={(e) => setFormData({ ...formData, masterName: e.target.value })}
                sx={{
                  color: '#FFFFFF',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(197, 154, 119, 0.3)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C59A77' },
                  '.MuiSvgIcon-root': { color: '#C59A77' },
                }}
              >
                {masters.map((m) => (
                  <MenuItem key={m.id} value={m.name}>
                    {m.name}
                  </MenuItem>
                ))}
                <MenuItem value="ЛЕЛЕЯ Team">ЛЕЛЕЯ Team</MenuItem>
              </Select>
            </FormControl>

            {/* Likes Count */}
            <TextField
              fullWidth
              type="number"
              label="Початкова кількість лайків"
              value={formData.likesCount}
              onChange={(e) => setFormData({ ...formData, likesCount: Number(e.target.value) })}
              variant="outlined"
              sx={{
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiFormLabel-root': { color: '#C59A77' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(197, 154, 119, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C59A77' },
              }}
            />

            {/* Description Multiline */}
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Опис роботи"
              placeholder="Деталі процедури, використані засоби догляду чи особливості стрижки..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              variant="outlined"
              sx={{
                '& .MuiInputBase-input': { color: '#FFFFFF' },
                '& .MuiFormLabel-root': { color: '#C59A77' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(197, 154, 119, 0.3)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C59A77' },
              }}
            />

          </DialogContent>

          <DialogActions className="p-6 border-t border-gold-600/20">
            <Button onClick={handleCloseModal} style={{ color: '#9CA3AF' }}>
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={creating}
              startIcon={creating ? <CircularProgress size={16} color="inherit" /> : <Sparkles />}
              style={{
                backgroundColor: '#C59A77',
                color: '#0C0C0E',
                fontWeight: 'bold',
                borderRadius: '10px',
                padding: '8px 20px',
              }}
            >
              {creating ? 'Публікація...' : 'Опублікувати'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

    </div>
  );
};

export default InstagramTab;
