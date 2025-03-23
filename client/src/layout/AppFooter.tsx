import { Link } from "react-router-dom";  // Đảm bảo đúng package import
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";
import { FiLogIn } from "react-icons/fi";
import { useSelector } from "react-redux";

const AppFooter: React.FC = () => {
    const user = useSelector((state) => state.auth.login.currentUser);

    return (
        <footer className="fixed bottom-0 left-0 w-full z-50">
            {/* Desktop Footer (Nền vô hình, chữ vẫn bấm được) */}
            <div className="hidden lg:flex justify-center pointer-events-none gradient">
                <div className="max-w-4xl w-full mx-auto px-6 flex justify-center items-center gap-2">
                    © 2025 Version 1.0.0 – Copyright by<div className="font-semibold text-[20px]">le quang sang</div>| ToolGiaRe.com
                </div>
            </div>

            {/* Mobile Footer (Hiển thị bình thường) */}
            <div className="dark:border-gray-800 lg:hidden w-full px-5 py-3 border-t bg-white dark:bg-[#101827] shadow-md dark:text-white">
                <div className="relative flex justify-between items-center">

                    {/* Nút chuyển đổi giao diện */}
                    <div className="ml-5">
                        <ThemeToggleButton />
                    </div>

                    {/* Avatar User Dropdown - Căn giữa và phóng to nhẹ */}
                    <div className="absolute left-1/2 top-[-30px] transform -translate-x-1/2 scale-150">
                        <UserDropdown />
                    </div>

                    {/* Nếu đã đăng nhập */}
                    {user ? (
                        <div>
                            {/* Nếu người dùng đã đăng nhập, có thể thay Link đăng nhập thành một nút đăng xuất */}
                            <Link
                                to="/profile" // Thay đổi đường dẫn nếu cần
                                className="flex items-center gap-2 gradient transition-all duration-200"
                            >
                                <div size={20} />Hi, {user.username}
                            </Link>
                        </div>
                    ) : (
                        // Nếu chưa đăng nhập, hiển thị nút đăng nhập
                        <div>
                            <Link
                                to="/signin"
                                className="flex items-center gap-2 gradient  transition-all duration-200"
                            >
                                <FiLogIn size={20} /> <div className="font-semibold text-[18px]">Đăng nhập</div>
                            </Link>
                        </div>
                    )}

                </div>
            </div>

        </footer>
    );
};

export default AppFooter;
