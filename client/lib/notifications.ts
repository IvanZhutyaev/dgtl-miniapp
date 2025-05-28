// notifications.ts
type NotificationType = 'success' | 'warning' | 'error';

export function showNotification(message: string, type: NotificationType) {
    // Create the container with horizontal padding
    const container = document.createElement("div");
    container.className = `
      fixed top-0 left-0 w-full z-50 pointer-events-none
      px-3 flex justify-center
    `;
  
    // Create the notification
    const notification = document.createElement("div");
    notification.className = `
      mt-3 w-full px-4 py-3 rounded-md shadow-md text-center
      whitespace-nowrap overflow-hidden text-ellipsis animate-slideIn pointer-events-auto
      ${type === "success" 
        ? "bg-green-500 text-white" 
        : type === "warning" 
        ? "bg-yellow-500 text-black" 
        : "bg-red-500 text-white"
      }
    `;
  
    notification.innerText = message;
  
    container.appendChild(notification);
    document.body.appendChild(container);
  
    // Slide out after 3s
    setTimeout(() => {
      notification.classList.remove("animate-slideIn");
      notification.classList.add("animate-slideOut");
      setTimeout(() => {
        if (container.parentNode) {
          document.body.removeChild(container);
        }
      }, 500);
    }, 3000);
  }
  
  
  
  