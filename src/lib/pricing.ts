export interface PricingTier {
    id: string;
    name: string;
    price: number;
    currency: string;
    period: 'month' | 'year' | 'lifetime';
    description: string;
    features: string[];
    highlight?: boolean;
    cta: string;
}

export const pricingTiers: PricingTier[] = [
    {
        id: 'monthly',
        name: 'Pro Monthly',
        price: 199000,
        currency: 'VND',
        period: 'month',
        description: 'Thanh toán hàng tháng. Hủy bất kỳ lúc nào.',
        features: [
            'Truy cập toàn bộ Khóa Học PRO',
            'Xem các bài học mới sớm nhất',
            'Tham gia Discord Member-only',
            'Source Code các bài thực hành nhỏ',
            'Hỗ trợ ưu tiên'
        ],
        cta: 'Đăng Ký Tháng',
        highlight: false
    },
    {
        id: 'yearly',
        name: 'Pro Yearly',
        price: 1990000,
        currency: 'VND',
        period: 'year',
        description: 'Tiết kiệm 2 tháng so với trả từng tháng.',
        features: [
            'Tất cả quyền lợi gói Monthly',
            'Tiết kiệm 17% chi phí',
            'Huy hiệu PRO Member trên Discord',
            'Tặng 1 Source Code Template (Basic)'
        ],
        cta: 'Đăng Ký Năm',
        highlight: true
    },
    {
        id: 'lifetime',
        name: 'Lifetime Access',
        price: 5000000,
        currency: 'VND',
        period: 'lifetime',
        description: 'Thanh toán 1 lần. Sở hữu trọn đời.',
        features: [
            'Truy cập trọn đời mọi khóa học',
            'Không bao giờ phải gia hạn',
            'Tặng 2 Source Code Premium bất kỳ',
            'Direct Support từ Dũng'
        ],
        cta: 'Mua Trọn Đời',
        highlight: false
    }
];
