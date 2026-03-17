import { StageData } from "@/types/game";

export const stages: StageData[] = [
  {
    id: 1,
    name: "Chặng 1: Tiến Công",
    subtitle: "Đại hội V và bối cảnh kinh tế - xã hội 1982-1986",
    mcTimeLimit: 100,
    questions: [
      {
        id: 1, type: "multiple-choice",
        question: "Đại hội đại biểu toàn quốc lần thứ V của Đảng diễn ra vào năm nào?",
        options: ["1980", "1981", "1982", "1983"],
        correctAnswer: 2,
      },
      {
        id: 2, type: "multiple-choice",
        question: "Đại hội V xác định nhiệm vụ hàng đầu của cách mạng Việt Nam là gì?",
        options: [
          "Công nghiệp hóa nặng",
          "Xây dựng CNXH và bảo vệ Tổ quốc",
          "Phát triển kinh tế thị trường",
          "Mở cửa hội nhập quốc tế",
        ],
        correctAnswer: 1,
      },
      {
        id: 3, type: "multiple-choice",
        question: "Tổng Bí thư được bầu tại Đại hội V là ai?",
        options: ["Lê Duẩn", "Trường Chinh", "Nguyễn Văn Linh", "Phạm Văn Đồng"],
        correctAnswer: 0,
      },
      {
        id: 4, type: "multiple-choice",
        question: "Đại hội V xác định ba chương trình kinh tế lớn bao gồm lương thực - thực phẩm, hàng tiêu dùng và gì?",
        options: ["Công nghiệp nặng", "Hàng xuất khẩu", "Năng lượng", "Giao thông vận tải"],
        correctAnswer: 1,
      },
      {
        id: 5, type: "multiple-choice",
        question: "Kế hoạch 5 năm lần thứ ba (1981-1985) tập trung vào phương hướng nào?",
        options: [
          "Ưu tiên phát triển công nghiệp nặng",
          "Ổn định và cải thiện đời sống nhân dân",
          "Phát triển kinh tế đối ngoại",
          "Tập trung quốc phòng an ninh",
        ],
        correctAnswer: 1,
      },
      {
        id: 6, type: "multiple-choice",
        question: "Chỉ thị 100-CT/TW (1981) về khoán sản phẩm trong nông nghiệp thường được gọi là gì?",
        options: ["Khoán 10", "Khoán 100", "Khoán hộ", "Khoán việc"],
        correctAnswer: 1,
      },
      {
        id: 7, type: "multiple-choice",
        question: "Tình hình kinh tế Việt Nam giai đoạn 1982-1985 gặp khó khăn chủ yếu do đâu?",
        options: [
          "Thiên tai lũ lụt",
          "Cơ chế quản lý kế hoạch hóa tập trung, bao cấp",
          "Chiến tranh biên giới kéo dài",
          "Thiếu tài nguyên thiên nhiên",
        ],
        correctAnswer: 1,
      },
      {
        id: 8, type: "multiple-choice",
        question: "Cuộc cải cách giá - lương - tiền năm 1985 đã dẫn đến hậu quả gì?",
        options: [
          "Kinh tế tăng trưởng mạnh",
          "Lạm phát phi mã, đời sống khó khăn",
          "Xuất khẩu tăng vọt",
          "Ổn định tiền tệ",
        ],
        correctAnswer: 1,
      },
      {
        id: 9, type: "multiple-choice",
        question: "Nghị quyết Trung ương 8 khóa V (1985) đề cập đến vấn đề gì quan trọng?",
        options: [
          "Đổi mới cơ chế quản lý kinh tế",
          "Tăng cường quốc phòng",
          "Cải cách giáo dục",
          "Mở rộng quan hệ ngoại giao",
        ],
        correctAnswer: 0,
      },
      {
        id: 10, type: "multiple-choice",
        question: "Tỷ lệ lạm phát ở Việt Nam năm 1986 lên tới mức nào?",
        options: ["Khoảng 100%", "Khoảng 300%", "Khoảng 500%", "Khoảng 700%"],
        correctAnswer: 3,
      },
    ],
  },
  {
    id: 2,
    name: "Chặng 2: Phá Cổng",
    subtitle: "Các bước đột phá đổi mới tư duy kinh tế",
    mcTimeLimit: 100,
    questions: [
      // 10 MC questions
      {
        id: 11, type: "multiple-choice",
        question: "Hội nghị Trung ương 6 khóa V (1984) có ý nghĩa gì trong quá trình đổi mới?",
        options: [
          "Chính thức phát động Đổi mới",
          "Bước đầu thừa nhận sản xuất hàng hóa và quy luật giá trị",
          "Ban hành Luật Đầu tư nước ngoài",
          "Giải thể hợp tác xã nông nghiệp",
        ],
        correctAnswer: 1,
      },
      {
        id: 12, type: "multiple-choice",
        question: "'Phá rào' trong kinh tế giai đoạn 1982-1986 chủ yếu diễn ra ở đâu?",
        options: [
          "Hà Nội và Hải Phòng",
          "TP. Hồ Chí Minh và Long An",
          "Đà Nẵng và Huế",
          "Cần Thơ và An Giang",
        ],
        correctAnswer: 1,
      },
      {
        id: 13, type: "multiple-choice",
        question: "Mô hình 'khoán sản phẩm đến nhóm và người lao động' (Khoán 100) áp dụng trong lĩnh vực nào?",
        options: ["Công nghiệp", "Nông nghiệp", "Thương mại", "Dịch vụ"],
        correctAnswer: 1,
      },
      {
        id: 14, type: "multiple-choice",
        question: "Kết quả nổi bật nhất của Khoán 100 là gì?",
        options: [
          "Sản lượng lương thực tăng đáng kể",
          "Kim ngạch xuất khẩu tăng gấp đôi",
          "Xóa bỏ hoàn toàn tem phiếu",
          "Giảm lạm phát về 0%",
        ],
        correctAnswer: 0,
      },
      {
        id: 15, type: "multiple-choice",
        question: "Đại hội V nhấn mạnh mối quan hệ giữa Việt Nam với quốc gia nào là 'hòn đá tảng'?",
        options: ["Trung Quốc", "Liên Xô", "Cuba", "Lào"],
        correctAnswer: 1,
      },
      {
        id: 16, type: "multiple-choice",
        question: "Nghị quyết Trung ương 3 khóa V (1982) đề cập đến vấn đề gì?",
        options: [
          "Phân phối lưu thông",
          "Cải cách ruộng đất",
          "Hợp nhất các tỉnh",
          "Đổi mới giáo dục",
        ],
        correctAnswer: 0,
      },
      {
        id: 17, type: "multiple-choice",
        question: "Giai đoạn 1982-1986, Việt Nam nhận viện trợ kinh tế chủ yếu từ khối nào?",
        options: ["Phương Tây", "SEV (Hội đồng tương trợ kinh tế)", "ASEAN", "Ngân hàng Thế giới"],
        correctAnswer: 1,
      },
      {
        id: 18, type: "multiple-choice",
        question: "Điểm mới trong tư duy kinh tế của Đại hội V so với Đại hội IV là gì?",
        options: [
          "Chủ trương công nghiệp hóa bằng mọi giá",
          "Coi nông nghiệp là mặt trận hàng đầu",
          "Ưu tiên phát triển công nghiệp nặng",
          "Xóa bỏ kinh tế tập thể",
        ],
        correctAnswer: 1,
      },
      {
        id: 19, type: "multiple-choice",
        question: "Năm 1985, sự kiện 'đổi tiền' tại Việt Nam diễn ra vào tháng nào?",
        options: ["Tháng 3", "Tháng 6", "Tháng 9", "Tháng 12"],
        correctAnswer: 2,
      },
      {
        id: 20, type: "multiple-choice",
        question: "Trước Đại hội VI (1986), ai là người đề xuất mạnh mẽ nhất việc nhìn thẳng vào sự thật?",
        options: ["Lê Duẩn", "Trường Chinh", "Nguyễn Văn Linh", "Võ Văn Kiệt"],
        correctAnswer: 1,
      },
      // 2 fill-in questions
      {
        id: 21, type: "fill-in",
        question: "Đại hội đại biểu toàn quốc lần thứ V diễn ra tại thành phố nào?",
        correctAnswer: "Hà Nội",
        timeLimit: 15,
      },
      {
        id: 22, type: "fill-in",
        question: "Ba chương trình kinh tế lớn của Đại hội V gồm: lương thực - thực phẩm, hàng tiêu dùng và hàng ___?",
        correctAnswer: "xuất khẩu",
        timeLimit: 15,
      },
    ],
  },
  {
    id: 3,
    name: "Chặng 3: Cắm Cờ",
    subtitle: "Từ khủng hoảng đến tiền đề Đổi mới 1986",
    mcTimeLimit: 100,
    questions: [
      // 10 MC questions
      {
        id: 23, type: "multiple-choice",
        question: "Tổng Bí thư Lê Duẩn qua đời vào năm nào?",
        options: ["1984", "1985", "1986", "1987"],
        correctAnswer: 2,
      },
      {
        id: 24, type: "multiple-choice",
        question: "Ai giữ chức Tổng Bí thư sau khi Lê Duẩn qua đời (tháng 7/1986)?",
        options: ["Nguyễn Văn Linh", "Trường Chinh", "Phạm Văn Đồng", "Võ Chí Công"],
        correctAnswer: 1,
      },
      {
        id: 25, type: "multiple-choice",
        question: "Trường Chinh đã có đóng góp gì quan trọng nhất trong giai đoạn chuẩn bị Đại hội VI?",
        options: [
          "Soạn thảo Hiến pháp mới",
          "Đổi mới tư duy lý luận, chuẩn bị văn kiện Đại hội VI",
          "Ký hiệp định hòa bình",
          "Cải cách quân đội",
        ],
        correctAnswer: 1,
      },
      {
        id: 26, type: "multiple-choice",
        question: "Tình trạng 'ngăn sông cấm chợ' trong giai đoạn này có nghĩa là gì?",
        options: [
          "Cấm đánh bắt cá trên sông",
          "Hạn chế lưu thông hàng hóa giữa các địa phương",
          "Cấm xây dựng chợ mới",
          "Kiểm soát giao thông đường thủy",
        ],
        correctAnswer: 1,
      },
      {
        id: 27, type: "multiple-choice",
        question: "Bài học lớn nhất mà Đảng rút ra từ giai đoạn 1982-1986 là gì?",
        options: [
          "Phải tăng cường quốc phòng",
          "Phải tôn trọng quy luật khách quan",
          "Phải duy trì bao cấp",
          "Phải tăng viện trợ nước ngoài",
        ],
        correctAnswer: 1,
      },
      {
        id: 28, type: "multiple-choice",
        question: "Sản lượng lương thực quy thóc năm 1985 của Việt Nam đạt khoảng bao nhiêu triệu tấn?",
        options: ["12 triệu", "15 triệu", "18 triệu", "21 triệu"],
        correctAnswer: 2,
      },
      {
        id: 29, type: "multiple-choice",
        question: "Mô hình kinh tế nào được thí điểm tại TP.HCM giai đoạn 1982-1985 và coi là 'phá rào'?",
        options: [
          "Kinh tế quốc doanh thuần túy",
          "Cho doanh nghiệp tự hạch toán, tìm nguồn nguyên liệu",
          "Tư nhân hóa hoàn toàn",
          "Kinh tế hợp tác xã mới",
        ],
        correctAnswer: 1,
      },
      {
        id: 30, type: "multiple-choice",
        question: "Đại hội V có bao nhiêu đại biểu tham dự?",
        options: ["Khoảng 800", "Khoảng 1.000", "Khoảng 1.033", "Khoảng 1.200"],
        correctAnswer: 2,
      },
      {
        id: 31, type: "multiple-choice",
        question: "Nghị quyết nào đánh dấu bước đột phá tư duy về cơ chế quản lý kinh tế trước Đại hội VI?",
        options: [
          "Nghị quyết TW 6 khóa IV",
          "Nghị quyết TW 8 khóa V",
          "Nghị quyết TW 3 khóa V",
          "Nghị quyết TW 10 khóa V",
        ],
        correctAnswer: 1,
      },
      {
        id: 32, type: "multiple-choice",
        question: "Đại hội VI (12/1986) được gọi là 'Đại hội' gì?",
        options: [
          "Đại hội thống nhất",
          "Đại hội Đổi mới",
          "Đại hội hòa bình",
          "Đại hội công nghiệp hóa",
        ],
        correctAnswer: 1,
      },
      // 2 fill-in
      {
        id: 33, type: "fill-in",
        question: "Đại hội VI đã thẳng thắn chỉ ra sai lầm trong nhận thức và vận dụng quy luật ___ trong thời kỳ quá độ.",
        correctAnswer: "khách quan",
        timeLimit: 15,
      },
      {
        id: 34, type: "fill-in",
        question: "Phương châm mà Trường Chinh nêu ra để chuẩn bị Đại hội VI: 'Nhìn thẳng vào ___, đánh giá đúng sự thật, nói rõ sự thật'.",
        correctAnswer: "sự thật",
        timeLimit: 15,
      },
      // 3 image fill-in
      {
        id: 35, type: "image-fill-in",
        question: "Đây là ai? Người giữ chức Tổng Bí thư tại Đại hội V.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/vi/0/0e/Le_Duan.jpg",
        correctAnswer: "Lê Duẩn",
        timeLimit: 15,
      },
      {
        id: 36, type: "image-fill-in",
        question: "Đây là ai? Người khởi xướng đổi mới tư duy, giữ chức TBT từ tháng 7/1986.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/vi/f/f7/Truong_chinh.jpg",
        correctAnswer: "Trường Chinh",
        timeLimit: 15,
      },
      {
        id: 37, type: "image-fill-in",
        question: "Đây là ai? Bí thư Thành ủy TP.HCM, người tiên phong 'phá rào' kinh tế.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/vi/b/be/Vo_Van_Kiet.jpg",
        correctAnswer: "Võ Văn Kiệt",
        timeLimit: 15,
      },
    ],
  },
];
