export const BIKE_COLORS = [
  { bg: "bg-[#4285F4]", text: "text-[#4285F4]", border: "border-blue-100", light: "bg-blue-50/30" }, // Google Blue
  { bg: "bg-[#EA4335]", text: "text-[#EA4335]", border: "border-red-100", light: "bg-red-50/30" },  // Google Red
  { bg: "bg-[#FBBC05]", text: "text-[#FBBC05]", border: "border-yellow-100", light: "bg-yellow-50/30" }, // Google Yellow
  { bg: "bg-[#34A853]", text: "text-[#34A853]", border: "border-green-100", light: "bg-green-50/30" }, // Google Green
];

export const API_ENDPOINTS = {
  FUEL_PROXY: "/api/proxy/fuel",
  VEHICLE_PROXY: "/api/proxy/vehicles",
  FUEL_DIRECT: (date: string) => `https://giaxanghomnay.com/api/pvdate/${date}`,
};

export const MESSAGES = {
  LOADING_DATA: "Đang tải dữ liệu...",
  UPDATING_DATA: "Đang cập nhật...",
  FUEL_FETCH_ERROR: "Không thể tải dữ liệu giá xăng.",
  VEHICLE_FETCH_ERROR: "Không thể tải dữ liệu xe.",
  INVALID_DATA_FORMAT: "Dữ liệu không đúng định dạng",
  NO_VEHICLE_SELECTED: "Vui lòng chọn xe để xem bảng so sánh",
  SEARCH_PLACEHOLDER_BIKE: "Nhập tên xe (ví dụ: Vision, SH...)",
  SEARCH_PLACEHOLDER_CAR: "Nhập tên xe (ví dụ: Vios, Camry...)",
  SEARCH_LABEL_BIKE: "Tìm Kiếm Loại Xe Máy",
  SEARCH_LABEL_CAR: "Tìm Kiếm Loại Xe Hơi",
  UNKNOWN_VEHICLE: "Không rõ tên xe",
  UNKNOWN_FUEL: "Không rõ loại xăng",
  NO_FUEL_DATA: "Không có dữ liệu giá xăng",
  DUMMY_SUFFIX: " (Mẫu)",
  UNKNOWN_BIKE: "Xe không tên",
  UNIT_VND_SHORT: "VND",
  LOADING_PLACEHOLDER: "...",
  FILTER_KEROSENE: "dầu hỏa",
  FILTER_DIESEL: "do",
}; 

export const UI_TEXT = {
  APP_TITLE: "Đầy Bình",
  FUEL_SECTION_GAS: "Xăng",
  FUEL_SECTION_OTHER: "Dầu hỏa & DO",
  CALCULATOR_TITLE: "Bảng Giá Đổ Đầy Bình",
  CALCULATOR_TITLE_BIKE: "Bảng Giá Đổ Đầy Bình Xe Máy",
  CALCULATOR_TITLE_CAR: "Bảng Giá Đổ Đầy Bình Xe Hơi",
  CALCULATOR_SUBTITLE: "Tìm xe để xem chi phí cho tất cả loại xăng",
  UNIT_VND_PER_LITRE: "VND / Lít",
  UNIT_LITRE: "Lít",
  UNIT_VND: "VND",
  LAST_UPDATED: "Cập nhật",
  COMPARE_TABLE_LABEL: "Bảng So Sánh Chi Phí (Dự Kiến)",
  COMPARE_TABLE_UNIT: "* Đơn vị: VND",
  REFRESH_BUTTON: "Làm mới dữ liệu",
  DATA_SOURCE: "Dữ liệu được cung cấp bởi giaxanghomnay & VNExpress",
  TAB_MOTORCYCLE: "Xe Máy",
  TAB_CAR: "Xe Hơi",
  TABLE_COL_VEHICLE_NAME: "Tên Xe",
  ACTION_DELETE: "Xóa",
  ACTION_DELETE_VEHICLE: "Xoá xe",
  ACTION_ADD_MORE: (count: number) => `Chọn thêm (còn ${count})`,
};

export const CONFIG = {
  MAX_BIKES: 10,
  MAX_CARS: 5,
  REFRESH_INTERVAL_MS: 300000, // 5 minutes
};
