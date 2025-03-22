import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import { FaFacebook, FaTelegram, FaCommentDots } from "react-icons/fa";
import { SiZalo } from "react-icons/si";

export default function Blank() {
  return (
    <div>
      <PageMeta
        title="Chức năng đang phát triển "
        description="Trang này hiện đang được phát triển. Hãy góp ý để chúng tôi hoàn thiện tốt hơn!"
      />
      <PageBreadcrumb pageTitle="Chức năng đang phát triển" />
      <div className="min-h-[75vh] flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        
        {/* Thông báo trang đang phát triển */}
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            🚧 Chức năng đang phát triển 🚀
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">
            Chúng tôi đang hoàn thiện chức năng này. Nếu bạn có ý tưởng hay góp ý, hãy liên hệ với chúng tôi qua các nền tảng sau:
          </p>
        </div>

        {/* Khu vực góp ý */}
        <div className="mt-6 flex space-x-4">
          <a
            href="https://t.me/toolgiare_com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <FaTelegram size={24} />
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=100083262396070"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-blue-700 text-white hover:bg-blue-800 transition"
          >
            <FaFacebook size={24} />
          </a>

          <a
            href="https://zalo.me/0765911234"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-blue-500 text-white hover:bg-green-600 transition"
          >
            <SiZalo size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}
