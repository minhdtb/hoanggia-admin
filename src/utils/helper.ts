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
