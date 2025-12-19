export default function SearchSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Học Lập Trình Cùng Dũng",
    "url": "https://hoclaptrinhcungdung.com",
    "description": "Nền tảng học lập trình qua dự án thực tế, cung cấp khóa học và source code website chất lượng cao.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://hoclaptrinhcungdung.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Học Lập Trình Cùng Dũng",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hoclaptrinhcungdung.com/logo.png"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
