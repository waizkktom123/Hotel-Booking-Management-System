export interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: "Available" | "Occupied" | "Cleaning" | "Maintenance";
  floor: number;
  amenities: string[];
  image: string;
}

export interface Booking {
  id: string;
  guestName: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  roomNumber?: string;
  cost: number;
  status: "Confirmed" | "Pending" | "Cancelled";
  paymentStatus: "Paid" | "Pending" | "Refunded";
  paymentMethod: "Stripe" | "PayPal" | "EnterpriseCredit";
  guests: number;
  rating: number;
  review: string;
  qrCodeUrl: string;
}

export interface Review {
  id: string;
  guestName: string;
  roomType: string;
  rating: number;
  comment: string;
  status: "Approved" | "Pending" | "Rejected";
  date: string;
}

// Navigation structure for C# and Angular codebase files
export interface CodeFile {
  path: string;
  name: string;
  language: "typescript" | "csharp" | "sql";
  content: string;
  category: "Angular Standalone" | "ASP.NET Core Web API (C#)" | "SQL Server DB Scripts" | "API Documentation";
}
