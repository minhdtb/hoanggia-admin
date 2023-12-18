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
