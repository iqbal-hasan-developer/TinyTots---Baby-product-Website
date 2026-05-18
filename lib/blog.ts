export interface BlogPost {
  id: string;
  title: string;
  titleBn: string;
  slug: string;
  category: string;
  categoryBn: string;
  excerpt: string;
  excerptBn: string;
  image: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How to Prevent Diaper Rash in Humid Weather",
    titleBn: "আর্দ্র আবহাওয়ায় ডায়াপার র‍্যাশ কীভাবে কমাবেন",
    slug: "prevent-diaper-rash-humid-weather",
    category: "Diapering",
    categoryBn: "ডায়াপারিং",
    excerpt: "Simple diaper changing habits that help keep your baby comfortable during hot and humid days.",
    excerptBn: "গরম ও আর্দ্র দিনে শিশুকে আরামদায়ক রাখতে সহজ ডায়াপার পরিবর্তনের অভ্যাস।",
    image: "/blog/blog-1.png",
    date: "May 10, 2026",
  },
  {
    id: "2",
    title: "Newborn Shopping Checklist for First-Time Parents",
    titleBn: "নতুন বাবা-মায়ের জন্য নবজাতক শপিং চেকলিস্ট",
    slug: "newborn-shopping-checklist",
    category: "Guides",
    categoryBn: "গাইড",
    excerpt: "A practical list of newborn essentials to buy before your baby arrives, without over-shopping.",
    excerptBn: "শিশু আসার আগে অতিরিক্ত কেনাকাটা ছাড়া দরকারি নবজাতক পণ্যের ব্যবহারিক তালিকা।",
    image: "/blog/blog-2.png",
    date: "May 5, 2026",
  },
  {
    id: "3",
    title: "Baby Skincare Tips for Bangladesh Weather",
    titleBn: "বাংলাদেশের আবহাওয়ায় শিশুর ত্বকের যত্নের টিপস",
    slug: "baby-skincare-bangladesh-weather",
    category: "Skincare",
    categoryBn: "স্কিনকেয়ার",
    excerpt: "How to choose gentle bath, lotion, and wipe products for changing seasons in Bangladesh.",
    excerptBn: "বাংলাদেশের ঋতু পরিবর্তনে কোমল বাথ, লোশন ও ওয়াইপস পণ্য বাছাইয়ের উপায়।",
    image: "/blog/blog-3.png",
    date: "April 28, 2026",
  },
  {
    id: "4",
    title: "Feeding Essentials That Make Night Feeds Easier",
    titleBn: "রাতের ফিডিং সহজ করতে দরকারি ফিডিং এসেনশিয়ালস",
    slug: "feeding-essentials-night-feeds",
    category: "Feeding",
    categoryBn: "ফিডিং",
    excerpt: "From safe bottles to bibs, these small items can make feeding time smoother for new parents.",
    excerptBn: "নিরাপদ বোতল থেকে বিব পর্যন্ত, ছোট ছোট কিছু পণ্য নতুন বাবা-মায়ের ফিডিং সময়কে সহজ করে।",
    image: "/blog/blog-4.png",
    date: "April 15, 2026",
  }
];