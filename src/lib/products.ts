export interface Review {
    id: string;
    user: string;
    avatar: string;
    rating: number;
    date: string;
    content: string;
}

export interface Product {
    id: string;
    title: string;
    slug: string; 
    description: string;
    longDescription?: string;
    features?: string[];
    image: string;
    gallery?: string[]; // Multiple images
    reviews?: Review[]; // User reviews
    price: number;
    originalPrice?: number;
    tags: string[];
    link: string;
}

export const products: Product[] = [
    {
        id: '1',
        title: 'Bộ Source Code Fullstack Next.js',
        slug: 'nextjs-fullstack-source',
        description: 'Mã nguồn website khóa học này (HocLapTrinhCungDung Clone). Bao gồm Auth, Database, Payment Integration.',
        longDescription: 'Sở hữu ngay mã nguồn hoàn chỉnh của một nền tảng học trực tuyến hiện đại. Được xây dựng với công nghệ mới nhất: Next.js 14 (App Router), Prisma ORM, và PostgreSQL. Tích hợp sẵn hệ thống đăng nhập (Google/GitHub) và thanh toán.',
        features: [
            'Next.js 14 App Router & Server Actions',
            'Authentication (Auth.js v5)',
            'PostgreSQL & Prisma ORM',
            'Thanh toán Stripe/PayOS',
            'Giao diện Dark Mode cực đẹp'
        ],
        image: 'https://fireship.io/courses/nextjs/img.webp',
        gallery: [
            'https://fireship.io/courses/nextjs/img.webp',
            'https://fireship.io/courses/react-native/img.webp',
            'https://fireship.io/courses/supabase/img.webp'
        ],
        reviews: [
            {
                id: 'r1',
                user: 'Nguyễn Văn Nam',
                avatar: 'https://i.pravatar.cc/150?u=1',
                rating: 5,
                date: '2024-03-10',
                content: 'Source code rất sạch và dễ hiểu. Đáng đồng tiền bát gạo!'
            },
            {
                id: 'r2',
                user: 'Trần Thị Hạnh',
                avatar: 'https://i.pravatar.cc/150?u=2',
                rating: 4,
                date: '2024-03-08',
                content: 'Giao diện đẹp, nhưng cần thêm document hướng dẫn kỹ hơn chút.'
            }
        ],
        price: 999000,
        originalPrice: 2000000,
        tags: ['Next.js', 'Prisma', 'Stripe'],
        link: '#'
    },
    {
        id: '2',
        title: 'Template Bán Hàng PRO',
        slug: 'ecommerce-template-pro',
        description: 'Giao diện E-commerce tối ưu SEO, hiệu năng cao với Next.js 14 và Tailwind CSS.',
        longDescription: 'Template bán hàng chuẩn SEO, tối ưu Core Web Vitals. Thiết kế Mobile-first, tương thích mọi thiết bị. Tích hợp sẵn giỏ hàng, trang thanh toán và quản lý sản phẩm cơ bản.',
        features: [
            'Tối ưu SEO 100 điểm',
            'Responsive Design (Mobile First)',
            'Giỏ hàng (Zustand)',
            'Components UI tái sử dụng',
            'Hỗ trợ đa ngôn ngữ (i18n)'
        ],
        image: 'https://fireship.io/courses/react-native/img.webp',
        gallery: [
             'https://fireship.io/courses/react-native/img.webp',
             'https://fireship.io/courses/javascript/img.webp'
        ],
        reviews: [
            {
                id: 'r3',
                user: 'Lê Minh Khôi',
                avatar: 'https://i.pravatar.cc/150?u=3',
                rating: 5,
                date: '2024-03-12',
                content: 'Template chạy rất mượt, điểm Google Speed cao.'
            }
        ],
        price: 499000,
        tags: ['E-commerce', 'UI/UX', 'Template'],
        link: '#'
    },
    {
        id: '3',
        title: 'SaaS Boilerplate',
        slug: 'saas-boilerplate',
        description: 'Khởi động dự án Startup nhanh chóng với Authentication, Subscription, và Dashboard quản lý.',
        longDescription: 'Bộ khung khởi nghiệp hoàn hảo cho các dự án SaaS. Giúp bạn tiết kiệm 2 tháng phát triển các tính năng cơ bản như: Đăng ký/Đăng nhập, Quản lý gói cước (Subscription), Dashboard Admin, và Email Marketing.',
        features: [
            'User Management System',
            'Subscription (Recurring Billing)',
            'Admin Dashboard',
            'Email Templates (React Email)',
            'API Rate Limiting'
        ],
        image: 'https://fireship.io/courses/supabase/img.webp',
        gallery: [
            'https://fireship.io/courses/supabase/img.webp',
            'https://fireship.io/courses/stripe/img.webp'
        ],
        reviews: [],
        price: 1500000,
        originalPrice: 3000000,
        tags: ['SaaS', 'Boilerplate', 'Startup'],
        link: '#'
    }
];
