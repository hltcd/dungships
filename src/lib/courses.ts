export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  tags: string[];
  lessons: {
    title: string;
    slug: string;
    isFree: boolean;
    duration: string;
  }[];
}

export const courses: Course[] = [
  {
    id: '1',
    title: 'Khóa Học Next.js 14 Toàn Diện',
    slug: 'nextjs-full-course',
    description: 'Hướng dẫn tối ưu để xây dựng các ứng dụng web hiệu năng cao với App Router, Server Actions và Prisma.',
    image: 'https://fireship.io/courses/nextjs/img.webp', // Placeholder or real image if available
    tags: ['nextjs', 'react', 'fullstack'],
    lessons: [
      { title: 'Giới Thiệu Next.js', slug: 'intro', isFree: true, duration: '10:05' },
      { title: 'Định Tuyến & Layouts', slug: 'routing', isFree: true, duration: '15:30' },
      { title: 'Data Fetching', slug: 'data-fetching', isFree: false, duration: '20:00' },
      { title: 'Server Actions', slug: 'server-actions', isFree: false, duration: '18:45' },
    ]
  },
  {
    id: '2',
    title: 'React Native cho Người Mới',
    slug: 'react-native-beginners',
    description: 'Xây dựng ứng dụng mobile đa nền tảng cho iOS và Android sử dụng React Native và Expo.',
    image: 'https://fireship.io/courses/react-native/img.webp',
    tags: ['react-native', 'mobile', 'ios', 'android'],
    lessons: [
      { title: 'Thiết Lập Môi Trường', slug: 'setup', isFree: true, duration: '08:20' },
      { title: 'View & Text', slug: 'components', isFree: true, duration: '12:10' },
      { title: 'Flexbox Style', slug: 'styling', isFree: false, duration: '14:50' },
    ]
  },
  {
    id: '3',
    title: 'Cơ Sở Dữ Liệu Supabase',
    slug: 'supabase-database',
    description: 'Làm chủ Postgres, Auth, và Realtime subscriptions với Supabase.',
    image: 'https://fireship.io/courses/supabase/img.webp',
    tags: ['supabase', 'postgres', 'backend'],
    lessons: [
      { title: 'Supabase là gì?', slug: 'what-is-supabase', isFree: true, duration: '05:00' },
      { title: 'Thiết kế Table', slug: 'table-design', isFree: false, duration: '25:00' },
      { title: 'Row Level Security', slug: 'rls', isFree: false, duration: '30:00' },
    ]
  },
   {
    id: '4',
    title: 'Javascript Nâng Cao',
    slug: 'js-advanced',
    description: 'Đi sâu vào các khái niệm cốt lõi của JS: Closure, Event Loop, Prototype...',
    image: 'https://fireship.io/courses/javascript/img.webp',
    tags: ['javascript', 'advanced'],
    lessons: [
       { title: 'Event Loop', slug: 'event-loop', isFree: true, duration: '10:00' },
       { title: 'Closures', slug: 'closures', isFree: false, duration: '12:00' },
    ]
  }
];
