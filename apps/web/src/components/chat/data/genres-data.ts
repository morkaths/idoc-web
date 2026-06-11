export interface Genre {
  key: string;
  query: string;
}

export const GENRES: readonly Genre[] = [
  // Sci-Fi
  { key: 'Khoa học viễn tưởng', query: 'science-fiction' },
  { key: 'Sci-Fi', query: 'science-fiction' },
  { key: 'Science Fiction', query: 'science-fiction' },
  
  // Fiction & Novels
  { key: 'Tiểu thuyết', query: 'fiction' },
  { key: 'Fiction', query: 'fiction' },
  { key: 'Novel', query: 'fiction' },
  { key: 'Phi hư cấu', query: 'non-fiction' },
  { key: 'Non-Fiction', query: 'non-fiction' },
  
  // Short Stories
  { key: 'Truyện ngắn', query: 'short-stories' },
  { key: 'Short Story', query: 'short-stories' },
  { key: 'Short Stories', query: 'short-stories' },
  
  // Horror
  { key: 'Kinh dị', query: 'horror' },
  { key: 'Horror', query: 'horror' },
  
  // Mystery & Detective
  { key: 'Trinh thám', query: 'mystery' },
  { key: 'Mystery', query: 'mystery' },
  { key: 'Thriller', query: 'thriller' },
  { key: 'Crime', query: 'crime' },
  { key: 'Detective', query: 'mystery' },
  
  // Fantasy
  { key: 'Huyền ảo', query: 'fantasy' },
  { key: 'Giả tưởng', query: 'fantasy' },
  { key: 'Fantasy', query: 'fantasy' },
  
  // Romance
  { key: 'Tình cảm', query: 'romance' },
  { key: 'Lãng mạn', query: 'romance' },
  { key: 'Romance', query: 'romance' },
  
  // Adventure
  { key: 'Phiêu lưu', query: 'adventure' },
  { key: 'Adventure', query: 'adventure' },
  
  // History & Historical Fiction
  { key: 'Lịch sử', query: 'history' },
  { key: 'History', query: 'history' },
  { key: 'Historical Fiction', query: 'historical-fiction' },
  { key: 'Historical', query: 'history' },
  
  // Biography & Memoirs
  { key: 'Tự truyện', query: 'biography' },
  { key: 'Hồi ký', query: 'biography' },
  { key: 'Biography', query: 'biography' },
  { key: 'Autobiography', query: 'biography' },
  { key: 'Memoir', query: 'memoir' },
  
  // Self-help & Personal Development
  { key: 'Kỹ năng sống', query: 'self-help' },
  { key: 'Phát triển bản thân', query: 'self-help' },
  { key: 'Self-help', query: 'self-help' },
  { key: 'Personal Development', query: 'self-help' },
  
  // Business, Economics & Finance
  { key: 'Kinh tế', query: 'business' },
  { key: 'Kinh doanh', query: 'business' },
  { key: 'Tài chính', query: 'business' },
  { key: 'Business', query: 'business' },
  { key: 'Economics', query: 'economics' },
  { key: 'Finance', query: 'finance' },
  
  // Technology & IT
  { key: 'Công nghệ', query: 'technology' },
  { key: 'Tin học', query: 'technology' },
  { key: 'Technology', query: 'technology' },
  { key: 'IT', query: 'technology' },
  
  // Science
  { key: 'Khoa học', query: 'science' },
  { key: 'Science', query: 'science' },
  
  // Education & Academics
  { key: 'Giáo dục', query: 'education' },
  { key: 'Học thuật', query: 'education' },
  { key: 'Education', query: 'education' },
  { key: 'Academic', query: 'academic' },
  
  // Poetry
  { key: 'Thơ', query: 'poetry' },
  { key: 'Poetry', query: 'poetry' },
  
  // Art
  { key: 'Nghệ thuật', query: 'art' },
  { key: 'Art', query: 'art' },
  
  // Classics & Young Adult
  { key: 'Cổ điển', query: 'classics' },
  { key: 'Classics', query: 'classics' },
  { key: 'Young Adult', query: 'young-adult' },
  { key: 'YA', query: 'young-adult' },
  { key: 'Childrens', query: 'childrens' }
] as const;
