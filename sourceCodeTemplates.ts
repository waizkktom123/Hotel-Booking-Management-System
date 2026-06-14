import { CodeFile } from "../types";

export const sourceCodeTemplates: CodeFile[] = [
  {
    category: "SQL Server DB Scripts",
    name: "01_Db_Schema_Setup.sql",
    path: "Database/01_Db_Schema_Setup.sql",
    language: "sql",
    content: `-- =========================================================================
-- SYSTEM:   Prestige Luxury Hotel Reservation Schema Setup
-- ENGINE:   SQL Server 2022+ / Azure SQL Database
-- AUTHOR:   Muhammad Waiz (Chief Systems Architect)
-- COMPAT:   NF Core 9.0+, Entity Framework Core DB-First & Code-First Ready
-- =========================================================================

CREATE DATABASE PrestigeHotelDB;
GO
USE PrestigeHotelDB;
GO

-- 1. Create Users & Roles Tables with proper constraints
CREATE TABLE [dbo].[Roles] (
    [RoleId] INT IDENTITY(1,1) PRIMARY KEY,
    [RoleName] NVARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE [dbo].[Users] (
    [UserId] INT IDENTITY(1,1) PRIMARY KEY,
    [FirstName] NVARCHAR(100) NOT NULL,
    [LastName] NVARCHAR(100) NOT NULL,
    [Email] NVARCHAR(150) NOT NULL UNIQUE,
    [PasswordHash] NVARCHAR(max) NOT NULL,
    [PhoneNumber] NVARCHAR(20) NULL,
    [RoleId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Roles]([RoleId]),
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [IsActive] BIT NOT NULL DEFAULT 1
);

-- 2. Hotels registration
CREATE TABLE [dbo].[Hotels] (
    [HotelId] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(200) NOT NULL,
    [Address] NVARCHAR(500) NOT NULL,
    [City] NVARCHAR(100) NOT NULL,
    [Country] NVARCHAR(100) NOT NULL,
    [Latitude] DECIMAL(9,6) NULL,
    [Longitude] DECIMAL(9,6) NULL,
    [Rating] DECIMAL(3,2) NOT NULL DEFAULT 5.0,
    [Description] NVARCHAR(MAX) NULL,
    [Email] NVARCHAR(150) NOT NULL,
    [Phone] NVARCHAR(50) NOT NULL,
    [ImageUrl] NVARCHAR(1000) NULL,
    [HasSpa] BIT NOT NULL DEFAULT 1,
    [HasInfinityPool] BIT NOT NULL DEFAULT 1
);

-- 3. Room Categories & Inventory
CREATE TABLE [dbo].[RoomTypes] (
    [RoomTypeId] INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL, -- 'Single Room', 'Double Room', 'Deluxe Room', 'Suite Room', 'Family Room'
    [Description] NVARCHAR(500) NULL,
    [MaxGuests] INT NOT NULL DEFAULT 2,
    [BasePrice] DECIMAL(18,2) NOT NULL
);

CREATE TABLE [dbo].[Rooms] (
    [RoomId] INT IDENTITY(1,1) PRIMARY KEY,
    [HotelId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Hotels]([HotelId]),
    [RoomTypeId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[RoomTypes]([RoomTypeId]),
    [RoomNumber] NVARCHAR(50) NOT NULL,
    [FloorNumber] INT NOT NULL,
    [Status] NVARCHAR(50) NOT NULL DEFAULT 'Available', -- 'Available', 'Occupied', 'Cleaning', 'Maintenance'
    [IsActive] BIT NOT NULL DEFAULT 1,
    CONSTRAINT UQ_Hotel_RoomNumber UNIQUE(HotelId, RoomNumber)
);

-- 4. Bookings Engine with Foreign Keys and Indexes
CREATE TABLE [dbo].[Bookings] (
    [BookingId] INT IDENTITY(1,1) PRIMARY KEY,
    [BookingReference] NVARCHAR(100) NOT NULL UNIQUE, -- 'BK-XXXXX' formatted reference
    [UserId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Users]([UserId]),
    [RoomId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Rooms]([RoomId]),
    [CheckInDate] DATE NOT NULL,
    [CheckOutDate] DATE NOT NULL,
    [TotalGuests] INT NOT NULL DEFAULT 1,
    [TotalCost] DECIMAL(18,2) NOT NULL,
    [Status] NVARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Cancelled'
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT CK_Dates CHECK (CheckOutDate > CheckInDate)
);

-- 5. Payments Ledger
CREATE TABLE [dbo].[Payments] (
    [PaymentId] INT IDENTITY(1,1) PRIMARY KEY,
    [BookingId] INT NOT NULL FOREIGN KEY REFERENCES [dbo].[Bookings]([BookingId]),
    [Amount] DECIMAL(18,2) NOT NULL,
    [PaymentDate] DATETIME2 NOT NULL DEFAULT GETDATE(),
    [PaymentMethod] NVARCHAR(100) NOT NULL, -- 'Stripe', 'PayPal'
    [TransactionId] NVARCHAR(250) NOT NULL UNIQUE,
    [Status] NVARCHAR(50) NOT NULL DEFAULT 'Successful' -- 'Successful', 'Pending', 'Refunded'
);

-- 6. Reviews Ledger
CREATE TABLE [dbo].[Reviews] (
    [ReviewId] INT IDENTITY(1,1) PRIMARY KEY,
    [BookingId] INT NOT NULL UNIQUE FOREIGN KEY REFERENCES [dbo].[Bookings]([BookingId]),
    [Rating] INT NOT NULL CHECK (Rating BETWEEN 1 AND 5),
    [Comment] NVARCHAR(MAX) NULL,
    [IsModerated] BIT NOT NULL DEFAULT 0,
    [IsApproved] BIT NOT NULL DEFAULT 1,
    [CreatedAt] DATETIME2 NOT NULL DEFAULT GETDATE()
);

-- Create Non-Clustered Indexes for Speed Operations
CREATE NONCLUSTERED INDEX IX_Bookings_Dates ON [dbo].[Bookings]([CheckInDate], [CheckOutDate]);
CREATE NONCLUSTERED INDEX IX_Rooms_Status ON [dbo].[Rooms]([Status]);
CREATE NONCLUSTERED INDEX IX_Users_Email ON [dbo].[Users]([Email]);
GO`
  },
  {
    category: "SQL Server DB Scripts",
    name: "02_Procedures_And_Seed.sql",
    path: "Database/02_Procedures_And_Seed.sql",
    language: "sql",
    content: `-- =========================================================================
-- SYSTEM:   Stored Procedures & Seeds
-- AUTHOR:   Muhammad Waiz
-- =========================================================================

-- Seed Data Setup
SET IDENTITY_INSERT [dbo].[Roles] ON;
INSERT INTO [dbo].[Roles] (RoleId, RoleName) VALUES (1, 'Admin'), (2, 'Manager'), (3, 'Guest');
SET IDENTITY_INSERT [dbo].[Roles] OFF;

SET IDENTITY_INSERT [dbo].[Users] ON;
INSERT INTO [dbo].[Users] (UserId, FirstName, LastName, Email, PasswordHash, RoleId)
VALUES 
(1, 'Admin', 'Officer', 'admin@prestige.com', 'AQAAAAEAACcQAAAAEGv...', 1),
(2, 'Muhammad', 'Waiz', 'waiz@prestige.com', 'AQAAAAEAACcQAAAAEH...', 2),
(3, 'Sophia', 'Loren', 'sophia@prestige.com', 'AQAAAAEAACcQAAAAEI...', 3);
SET IDENTITY_INSERT [dbo].[Users] OFF;

SET IDENTITY_INSERT [dbo].[Hotels] ON;
INSERT INTO [dbo].[Hotels] (HotelId, Name, Address, City, Country, Rating, Description, Email, Phone, ImageUrl)
VALUES (1, 'Prestige Silver Bay Resort', '101 Horizon Promenade', 'Maldives', 'Maldives', 5.00, 'Ultra-luxury paradise with private villas and glass floors.', 'concierge@silver-bay.prestige.com', '+9603310022', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b');
SET IDENTITY_INSERT [dbo].[Hotels] OFF;

SET IDENTITY_INSERT [dbo].[RoomTypes] ON;
INSERT INTO [dbo].[RoomTypes] (RoomTypeId, Name, Description, MaxGuests, BasePrice)
VALUES 
(1, 'Single Room', 'Sleek workspace optimized for business executives', 1, 150.00),
(2, 'Double Room', 'Elegant space with premium details and comfort', 2, 220.00),
(3, 'Deluxe Room', 'Vast layout offering premium horizon exposure', 2, 280.00),
(4, 'Suite Room', 'Ultimate master quarters with full custom jacuzzi', 3, 450.00),
(5, 'Family Room', 'Spacious duplex with home theater configurations', 5, 340.00);
SET IDENTITY_INSERT [dbo].[RoomTypes] OFF;

SET IDENTITY_INSERT [dbo].[Rooms] ON;
INSERT INTO [dbo].[Rooms] (RoomId, HotelId, RoomTypeId, RoomNumber, FloorNumber, Status)
VALUES 
(1, 1, 4, '101', 1, 'Available'),
(2, 1, 3, '110', 1, 'Available'),
(3, 1, 5, '201', 2, 'Occupied'),
(4, 1, 1, '205', 2, 'Available');
SET IDENTITY_INSERT [dbo].[Rooms] OFF;

GO
-- Stored Procedure to calculate dynamic seasonal price multiplier
CREATE PROCEDURE dbo.GetDynamicPrice
    @RoomId INT,
    @CheckInDate DATE,
    @CalculatedPrice DECIMAL(18,2) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @BasePrice DECIMAL(18,2);
    DECLARE @Month INT = MONTH(@CheckInDate);
    DECLARE @Multiplier DECIMAL(3,2) = 1.0; -- Standard season

    -- Select Base Price depending on room type
    SELECT @BasePrice = rt.BasePrice
    FROM dbo.Rooms r
    INNER JOIN dbo.RoomTypes rt ON r.RoomTypeId = rt.RoomTypeId
    WHERE r.RoomId = @RoomId;

    -- Dynamic Multipliers (Summer/Winter spikes in Maldives resort)
    IF @Month IN (12, 1, 2, 6, 7, 8)
    BEGIN
        SET @Multiplier = 1.25; -- Season peak pricing (+25%)
    END
    ELSE IF @Month IN (9, 10, 11)
    BEGIN
        SET @Multiplier = 0.90; -- Monsoon discounts (-10%)
    END

    SET @CalculatedPrice = @BasePrice * @Multiplier;
END;
GO`
  },
  {
    category: "ASP.NET Core Web API (C#)",
    name: "Room.cs / Entity Model",
    path: "Core/Entities/Room.cs",
    language: "csharp",
    content: `// =========================================================================
// SYSTEM:   Prestige Luxury Booking Management Domain Entities
// AUTHOR:   Muhammad Waiz
// =========================================================================

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PrestigeHotel.Core.Entities
{
    public class Room
    {
        [Key]
        public int RoomId { get; set; }

        public int HotelId { get; set; }
        
        [ForeignKey("HotelId")]
        public virtual Hotel Hotel { get; set; } = null!;

        public int RoomTypeId { get; set; }
        
        [ForeignKey("RoomTypeId")]
        public virtual RoomType RoomType { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string RoomNumber { get; set; } = string.Empty;

        public int FloorNumber { get; set; }

        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Available"; // Available, Occupied, Cleaning, Maintenance

        public bool IsActive { get; set; } = true;
        
        public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
} `
  },
  {
    category: "ASP.NET Core Web API (C#)",
    name: "IRoomRepository.cs / Abstraction",
    path: "Core/Interfaces/IRoomRepository.cs",
    language: "csharp",
    content: `using System.Collections.Generic;
using System.Threading.Tasks;
using PrestigeHotel.Core.Entities;

namespace PrestigeHotel.Core.Interfaces
{
    /// <summary>
    /// Repository abstraction for granular database procedures concerning Rooms.
    /// Implemented according to high-end modular Repository design principles by Muhammad Waiz.
    /// </summary>
    public interface IRoomRepository
    {
        Task<Room?> GetByIdAsync(int id);
        Task<IEnumerable<Room>> GetAllRoomsAsync(int? hotelId, string? status, int? roomTypeId);
        Task<bool> AddAsync(Room room);
        Task<bool> UpdateAsync(Room room);
        Task<bool> DeleteAsync(int id);
        Task<bool> IsRoomNumberAvailableAsync(int hotelId, string roomNumber);
    }
} `
  },
  {
    category: "ASP.NET Core Web API (C#)",
    name: "RoomRepository.cs / Infrastructure",
    path: "Infrastructure/Repositories/RoomRepository.cs",
    language: "csharp",
    content: `using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PrestigeHotel.Core.Entities;
using PrestigeHotel.Core.Interfaces;
using PrestigeHotel.Infrastructure.Data;

namespace PrestigeHotel.Infrastructure.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly ApplicationDbContext _context;

        public RoomRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Room?> GetByIdAsync(int id)
        {
            return await _context.Rooms
                .Include(r => r.RoomType)
                .Include(r => r.Hotel)
                .FirstOrDefaultAsync(r => r.RoomId == id);
        }

        public async Task<IEnumerable<Room>> GetAllRoomsAsync(int? hotelId, string? status, int? roomTypeId)
        {
            var query = _context.Rooms
                .Include(r => r.RoomType)
                .AsNoTracking()
                .AsQueryable();

            if (hotelId.HasValue)
                query = query.Where(r => r.HotelId == hotelId.Value);

            if (!string.IsNullOrEmpty(status))
                query = query.Where(r => r.Status == status);

            if (roomTypeId.HasValue)
                query = query.Where(r => r.RoomTypeId == roomTypeId.Value);

            return await query.ToListAsync();
        }

        public async Task<bool> AddAsync(Room room)
        {
            await _context.Rooms.AddAsync(room);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAsync(Room room)
        {
            _context.Rooms.Update(room);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return false;
            
            _context.Rooms.Remove(room);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> IsRoomNumberAvailableAsync(int hotelId, string roomNumber)
        {
            return !await _context.Rooms.AnyAsync(r => r.HotelId == hotelId && r.RoomNumber == roomNumber);
        }
    }
} `
  },
  {
    category: "ASP.NET Core Web API (C#)",
    name: "RoomsController.cs / ASP.NET API",
    path: "Controllers/RoomsController.cs",
    language: "csharp",
    content: `using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PrestigeHotel.Core.Entities;
using PrestigeHotel.Core.Interfaces;

namespace PrestigeHotel.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Requires authentication global check
    public class RoomsController : ControllerBase
    {
        private readonly IRoomRepository _roomRepository;

        public RoomsController(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetRoom(int id)
        {
            var r = await _roomRepository.GetByIdAsync(id);
            if (r == null) return NotFound(new { error = "Premium Room was not found." });
            return Ok(r);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetRooms([FromQuery] int? hotelId, [FromQuery] string? status, [FromQuery] int? roomTypeId)
        {
            var list = await _roomRepository.GetAllRoomsAsync(hotelId, status, roomTypeId);
            return Ok(list);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Manager")] // Role-Based Authorization
        public async Task<IActionResult> AddRoom([FromBody] Room model)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            
            bool available = await _roomRepository.IsRoomNumberAvailableAsync(model.HotelId, model.RoomNumber);
            if (!available) return BadRequest(new { Message = "Room number already exists in this resort asset." });

            bool success = await _roomRepository.AddAsync(model);
            if (!success) return StatusCode(500, "Error writing room records to database ledger.");

            return CreatedAtAction(nameof(GetRoom), new { id = model.RoomId }, model);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] Room model)
        {
            if (id != model.RoomId) return BadRequest();
            
            bool success = await _roomRepository.UpdateAsync(model);
            if (!success) return StatusCode(500, "Error updating target room.");

            return Ok(new { status = "Success", room = model });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            bool success = await _roomRepository.DeleteAsync(id);
            if (!success) return BadRequest(new { error = "Unable to delete or room does not exist." });
            return Ok(new { status = "Decommissioned successfully" });
        }
    }
} `
  },
  {
    category: "ASP.NET Core Web API (C#)",
    name: "PaymentController.cs / Stripe & PayPal Webhook",
    path: "Controllers/PaymentController.cs",
    language: "csharp",
    content: `using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe; // Direct original Stripe SDK import

namespace PrestigeHotel.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private const string StripeWebhookSecret = "whsec_PrestigeLuxurySignature2026_MuhammadWaiz";

        [HttpPost("charge-stripe")]
        [Authorize]
        public async Task<IActionResult> InitiateStripePayment([FromBody] ChargeRequestDto request)
        {
            try
            {
                StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

                var options = new PaymentIntentCreateOptions
                {
                    Amount = Convert.ToInt64(request.Cost * 100), // convert to cents
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" },
                    Metadata = new Dictionary<string, string>
                    {
                        { "BookingReference", request.BookingReference },
                        { "GuestEmail", request.GuestEmail }
                    }
                };

                var service = new PaymentIntentService();
                PaymentIntent intent = await service.CreateAsync(options);

                return Ok(new { 
                    clientSecret = intent.ClientSecret, 
                    transactionId = intent.Id,
                    priceTotal = request.Cost
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost("webhook-stripe")]
        public async Task<IActionResult> StripeCallbackWebhook()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    StripeWebhookSecret
                );

                if (stripeEvent.Type == Events.PaymentIntentSucceeded)
                {
                    var intent = stripeEvent.Data.Object as PaymentIntent;
                    // TODO: Trigger BookingConfirmation, QR passcode, Email notifying guest.
                    // Designed elegantly by Muhammad Waiz
                }

                return Ok();
            }
            catch (StripeException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }

    public class ChargeRequestDto
    {
        public string BookingReference { get; set; } = string.Empty;
        public decimal Cost { get; set; }
        public string GuestEmail { get; set; } = string.Empty;
    }
} `
  },
  {
    category: "Angular Standalone",
    name: "room-booking.component.ts / Signals & Reactive Forms",
    path: "src/app/rooms/room-booking.component.ts",
    language: "typescript",
    content: `import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RoomService } from '../services/room.service';

/**
 * Modern Angular 20 Standalone Room Booking Component
 * Leveraging Angular Signals for reactive state evaluation and responsive UI rendering.
 * Handcoded with precision by Muhammad Waiz.
 */
@Component({
  selector: 'app-room-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './room-booking.component.html',
  styleUrls: ['./room-booking.component.scss']
})
export class RoomBookingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roomService = inject(RoomService);
  private snackBar = inject(MatSnackBar);

  // Angular Signals for luxury live estimations
  selectedRoomPrice = signal<number>(280);
  bookingDays = signal<number>(1);
  promoMultiplier = signal<number>(1.0); // 3D exclusive loyalty discounts

  // Computed signals
  totalCost = computed(() => {
    return Math.round(this.selectedRoomPrice() * this.bookingDays() * this.promoMultiplier() * 100) / 100;
  });

  bookingForm!: FormGroup;
  minDate = new Date();

  ngOnInit(): void {
    this.bookingForm = this.fb.group({
      checkInDate: ['', [Validators.required]],
      checkOutDate: ['', [Validators.required]],
      guestCount: [1, [Validators.required, Validators.min(1), Validators.max(5)]],
      promoCode: ['']
    });

    // Subscribing to form date parameters to adjust computed signals
    this.bookingForm.valueChanges.subscribe(val => {
      if (val.checkInDate && val.checkOutDate) {
        const timeDiff = new Date(val.checkOutDate).getTime() - new Date(val.checkInDate).getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        if (days > 0) {
          this.bookingDays.set(days);
        }
      }

      const code = val.promoCode?.trim().toUpperCase();
      if (code === 'PRESTIGE2026') {
        this.promoMultiplier.set(0.85); // Elite 15% VIP discount
      } else {
        this.promoMultiplier.set(1.0);
      }
    });
  }

  onSubmitBooking(): void {
    if (this.bookingForm.invalid) {
      this.snackBar.open('Please configure valid luxurious parameters.', 'Close', { duration: 3000 });
      return;
    }

    const payload = {
      ...this.bookingForm.value,
      totalAmount: this.totalCost()
    };

    this.snackBar.open('Securing your premium reservation suite...', 'Arranging', { duration: 2000 });
    this.roomService.bookRoom(payload).subscribe({
      next: (res) => {
        this.snackBar.open('Room secured successfully! Invoice generated and QR ready.', 'Splendid', { duration: 5000 });
      },
      error: (err) => {
        this.snackBar.open('Reservation gateway is busy. Re-trying transaction.', 'Retry', { duration: 3000 });
      }
    });
  }
} `
  },
  {
    category: "Angular Standalone",
    name: "auth.guard.ts / Role-Based Protection",
    path: "src/app/core/guards/auth.guard.ts",
    language: "typescript",
    content: `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * Angular 20 Functional Authentication Guard with Role verification support.
 * Engineered for maximum performance and security by Muhammad Waiz.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    map(user => {
      if (!user) {
        // Redirect to elite custom login drawer
        router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      // Check required roles validation
      const expectedRoles = route.data['roles'] as Array<string>;
      if (expectedRoles && expectedRoles.length > 0) {
        const hasMatchingRole = expectedRoles.includes(user.role);
        if (!hasMatchingRole) {
          router.navigate(['/unauthorized']);
          return false;
        }
      }

      return true;
    })
  );
};`
  },
  {
    category: "Angular Standalone",
    name: "app.routes.ts / Dynamic Lazy Loading",
    path: "src/app/app.routes.ts",
    language: "typescript",
    content: `import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'customer/explore',
    pathMatch: 'full'
  },
  {
    path: 'customer',
    loadChildren: () => import('./customer/customer.routes').then(m => m.CUSTOMER_ROUTES)
  },
  {
    path: 'hotel-manager',
    loadComponent: () => import('./hotel-manager/dashboard.component').then(m => m.HotelManagerDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['Admin', 'Manager'] }
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: '**',
    loadComponent: () => import('./shared/not-found.component').then(m => m.NotFoundComponent)
  }
];`
  },
  {
    category: "API Documentation",
    name: "API_Endpoints_Metadata.md",
    path: "Swagger/API_Endpoints_Metadata.md",
    language: "sql",
    content: `# Prestige Luxury Hotel System API Blueprint & Specs
Enterprise REST Endpoints verified for OAuth2 integration, engineered by Muhammad Waiz.

## 1. Customer API
### Authenticate / AuthenticateGuest
* **Route**: \`POST https://api.prestigehotels2026.com/api/auth/login\`
* **Headers**: \`Content-Type: application/json\`
* **Payload**: 
  \`\`\`json
  { "email": "sophia@prestige.com", "password": "VipPassword2026!" }
  \`\`\`
* **Response (JWT Role Based)**: 
  \`\`\`json
  { "token": "eyJhbGciOiJIUzI1NiIsIn...", "user": { "id": 3, "name": "Sophia Loren", "role": "Guest" } }
  \`\`\`

### Dynamically Calculate Price & Book Room
* **Route**: \`POST https://api.prestigehotels2026.com/api/bookings\`
* **Bearer Token**: Required
* **Payload**:
  \`\`\`json
  { "roomId": 1, "checkIn": "2026-06-18", "checkOut": "2026-06-22", "paymentMethod": "Stripe" }
  \`\`\`
* **Response**:
  \`\`\`json
  { "bookingId": "BK-4912", "bookingReference": "PRESTIGE-Maldives-101", "totalCost": 1800.00, "invoiceUrl": "/api/invoices/BK-4912.pdf" }
  \`\`\`

## 2. Manager & Admin API
### Modify Room Properties (Inventory Maintenance)
* **Route**: \`PUT https://api.prestigehotels2026.com/api/rooms/{id}\`
* **Bearer Token**: Verified Admin or Manager roles required
* **Payload**:
  \`\`\`json
  { "roomId": 1, "status": "Maintenance", "isActive": true }
  \`\`\`
* **Response**:
  \`\`\`json
  { "success": true, "message": "Room status updated, availability calendar notified." }
  \`\`\`

### Retrieve Real-Time Revenue Analytics Dashboard data
* **Route**: \`GET https://api.prestigehotels2026.com/api/analytics/summary\`
* **Bearer Token**: Direct Admin constraint policy
* **Response (Data Visualizer formatted JSON)**:
  \`\`\`json
  { "totalRevenueYearly": 498100.00, "occupancyRate": "82.5%", "growthRate": "+14.8%", "dataPlots": [ {"month": "Jan", "revenue": 38000}, {"month": "Feb", "revenue": 45000} ] }
  \`\`\`
`
  }
];
