import { getAllUsers } from "../../redux/apiRequest";
import { deleteUser } from "../../redux/apiRequest"; // Import API xóa user
import { loginSuccess } from "../../redux/authSlice";
import {createAxios} from '../../createInstance'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";


export default function UserTable() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers); // ✅ Lấy danh sách user từ Redux
  console.log("Danh sách user từ Redux:", userList); // ✅ Kiểm tra dữ liệu Redux
  let axiosJWT = createAxios(user,dispatch,loginSuccess)

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      deleteUser(user?.accessToken, dispatch, id, axiosJWT)
    }
  }

  useEffect(() => {
    if (!user) {
      navigate('/signin')
    }
    if (user?.accessToken) {
      getAllUsers(user?.accessToken, dispatch,axiosJWT);
    }
  }, [user, dispatch]); // Chỉ gọi API khi user hoặc dispatch thay đổi

  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4">Danh sách người dùng</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">STT</th>
              <th className="border p-2">Tên</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Vai trò</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {userList && userList.length > 0 ?
              (userList.map((user, index) => (
                <tr key={user.id} className="text-center">
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2 text-blue-600 font-bold">
                    {user.role === "admin" ? "Admin" : "User"}
                  </td>
                  <td className="border p-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Sửa</button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded">Xóa</button>
                  </td>
                </tr>
              ))) : (
                <div>không có dữ liệu </div>
              )}
          </tbody>
        </table>

      </div>
    </main>
  );
}
