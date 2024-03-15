export function authStatusText(status: string): { text: string; color: string } | undefined {
  switch (status) {
    case 'Pending':
      return {
        text: 'Đăng ký',
        color: 'gray',
      };
    case 'WaitingApproval':
      return {
        text: 'Đang chờ duyệt',
        color: 'blue',
      };
    case 'Approved':
      return {
        text: 'Đã duyệt',
        color: 'green',
      };
    case 'Rejected':
      return {
        text: 'Từ chối',
        color: 'red',
      };
    case 'Blocked':
      return {
        text: 'Đã bị khóa',
        color: 'red',
      };
  }
}

export function driveStatusText(status: string): { text: string; color: string } | undefined {
  switch (status) {
    case 'Available':
      return {
        text: 'Sẵn sàng',
        color: 'green',
      };
    case 'Unavailable':
      return {
        text: 'Tạm ngừng',
        color: 'gray',
      };
  }
}

export function activeStatusText(status: string): { text: string; color: string } | undefined {
  switch (status) {
    case 'Active':
      return {
        text: 'Đang hoạt động',
        color: 'green',
      };
    case 'Inactive':
      return {
        text: 'Không hoạt động',
        color: 'gray',
      };
  }
}

export function transStatusText(status: string): { text: string; color: string } | undefined {
  switch (status) {
    case 'Pending':
      return {
        text: 'Đang chờ duyệt',
        color: 'gray',
      };
    case 'Approved':
      return {
        text: 'Đã duyệt',
        color: 'blue',
      };
    case 'Rejected':
      return {
        text: 'Từ chối',
        color: 'red',
      };
  }
}

export function transTypeText(status: string): { text: string; color: string } | undefined {
  switch (status) {
    case 'Withdrawal':
      return {
        text: 'Khấu trừ',
        color: 'red',
      };
    case 'Deposit':
      return {
        text: 'Nạp tiền',
        color: 'blue',
      };
  }
}

export function discountStatusText(status: string): { text: string; color: string } | undefined {
  switch (status) {
    case 'Active':
      return {
        text: 'Đang hoạt động',
        color: 'green',
      };
    case 'Inactive':
      return {
        text: 'Tạm dừng',
        color: 'gray',
      };
  }
}

export function reportStatusText(status: string): { text: string; color: string } | undefined {
  switch (status) {
    case 'Waiting':
      return {
        text: 'Đang chờ',
        color: 'gray',
      };
    case 'Doing':
      return {
        text: 'Đang xử lý',
        color: 'blue',
      };
    case 'Finished':
      return {
        text: 'Hoàn thành',
        color: 'green',
      };
    case 'Failed':
      return {
        text: 'Lỗi',
        color: 'red',
      };
  }
}

export function reportTypeText(status: number): { text: string; color: string } | undefined {
  switch (status) {
    case 0:
      return {
        text: 'Báo cáo tài chính',
        color: 'orange',
      };
    case 1:
      return {
        text: 'Báo cáo lái xe',
        color: 'green',
      };
    case 2:
      return {
        text: 'Báo cáo khách hàng',
        color: 'blue',
      };
  }
}


export function bookingStatusText(status: string): { text: string; color: string } | undefined {
  switch (status) {
    case 'Created':
      return {
        text: 'Đã tạo',
        color: 'green',
      };
    case 'Manual':
      return {
        text: 'Cần xử lý bằng tay',
        color: 'blue',
      };
    case 'Finding':
      return {
        text: 'Đang tìm kiếm',
        color: 'blue',
      };
    case 'Waiting':
      return {
        text: 'Đang chờ phản hồi',
        color: 'gray',
      };
    case 'Timeout':
      return {
        text: 'Đã hết thời gian',
        color: 'red',
      };
    case 'Declined':
      return {
        text: 'Đã từ chối',
        color: 'red',
      };
    case 'Accepted':
      return {
        text: 'Đã chấp nhận',
        color: 'black',
      };
    case 'OnGoing':
      return {
        text: 'Đang di chuyển',
        color: 'blue',
      };
    case 'Finished':
      return {
        text: 'Hoàn thành',
        color: 'green',
      };
    case 'Canceled':
      return {
        text: 'Đã hủy',
        color: 'red',
      };
  }
}

export function roleText(role: string): { text: string; color: string } | undefined {
  switch (role) {
    case 'Operator':
      return {
        text: 'Vận hành',
        color: 'blue',
      }
    case 'Accountant':
      return {
        text: 'Tài chính',
        color: 'green',
      }
  }
}

export function bookingTypeText(status: string): { text: string; color: string } | undefined {
  switch (status) {
    case '':
    case 'Automatic':
      return {
        text: 'Tự động',
        color: 'blue',
      };
    case 'Manual':
      return {
        text: 'Bằng tay',
        color: 'orange',
      };
  }
}
