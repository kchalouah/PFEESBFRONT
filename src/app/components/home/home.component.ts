import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatRippleModule } from "@angular/material/core";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatRippleModule],
  template: `
    <div class="home-container">
      <!-- Animated Background -->
      <div class="background-animation">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
        <div class="floating-shape shape-5"></div>
      </div>

      <!-- Hero Section -->
      <section class="hero-section">
        <!-- Main Welcome Card -->
        <div class="welcome-card">
          <!-- Safran Logo/Brand -->
          <div class="brand-header">
            <div class="brand-logo">
              <img src="safran-logo.png" alt="Safran" class="logo-image" />
            </div>
            <h1 class="brand-title">Safran Outillage</h1>
            <div class="brand-subtitle">Plateforme Industrielle Intégrée</div>
          </div>

          <!-- Main Content -->
          <div class="hero-content">
            <h2 class="hero-title">
              Bienvenue dans l'avenir de
              <span class="gradient-text">l'outillage industriel</span>
            </h2>
            <p class="hero-description">
              Gérez efficacement vos processus d'outillage avec notre plateforme moderne et intuitive.
              Optimisez vos opérations, suivez vos demandes et collaborez avec vos équipes.
            </p>



            <!-- Action Buttons -->
            <div class="actions">
              <a routerLink="/login" mat-raised-button class="primary-btn">
                <mat-icon>login</mat-icon>
                Se connecter
              </a>
              <a routerLink="/register" mat-raised-button class="secondary-btn">
                <mat-icon>person_add</mat-icon>
                Créer un compte
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer Info -->
      <footer class="footer-info">
        <div class="footer-content">
          <div class="footer-text">
            © 2025 Safran Group - Tous droits réservés
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .home-container {
      position: relative;
      min-height: 100vh;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%);
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    /* Animated Background */
    .background-animation {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      z-index: 1;
    }

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.03);
      animation: float 20s ease-in-out infinite;
    }

    .shape-1 {
      width: 300px;
      height: 300px;
      top: -150px;
      right: -150px;
      animation-delay: 0s;
    }

    .shape-2 {
      width: 200px;
      height: 200px;
      bottom: -100px;
      left: -100px;
      animation-delay: 5s;
    }

    .shape-3 {
      width: 150px;
      height: 150px;
      top: 20%;
      right: 10%;
      animation-delay: 10s;
    }

    .shape-4 {
      width: 100px;
      height: 100px;
      top: 60%;
      left: 5%;
      animation-delay: 15s;
    }

    .shape-5 {
      width: 80px;
      height: 80px;
      top: 30%;
      left: 20%;
      animation-delay: 7s;
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      z-index: 2;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
      max-width: 900px;
      margin: 0 auto;
      width: 100%;
    }

    /* Welcome Card */
    .welcome-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 32px;
      box-shadow: 0 32px 64px rgba(0, 0, 0, 0.15);
      padding: 48px;
      max-width: 800px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;
    }

    .welcome-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #1e40af, #3b82f6, #06b6d4);
    }

    /* Brand Header */
    .brand-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .brand-logo {
      margin: 0 auto 16px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .logo-image {
      height: 80px;
      width: auto;
      filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1));
      animation: pulse 3s ease-in-out infinite;
    }

    .brand-title {
      font-size: 36px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 8px 0;
      letter-spacing: -1px;
    }

    .brand-subtitle {
      color: #64748b;
      font-size: 16px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    /* Hero Content */
    .hero-content {
      text-align: center;
    }

    .hero-title {
      font-size: 32px;
      font-weight: 600;
      color: #1a1a1a;
      line-height: 1.2;
      margin: 0 0 24px 0;
    }

    .gradient-text {
      background: linear-gradient(135deg, #1e40af, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
    }

    .hero-description {
      font-size: 18px;
      color: #64748b;
      line-height: 1.6;
      margin: 0 0 40px 0;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin: 40px 0;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: rgba(248, 250, 252, 0.8);
      border-radius: 16px;
      border: 1px solid rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      background: rgba(30, 64, 175, 0.05);
      border-color: rgba(30, 64, 175, 0.2);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #dbeafe, #bfdbfe);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1e40af;
      flex-shrink: 0;
    }

    .feature-text {
      text-align: left;
    }

    .feature-title {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 4px;
    }

    .feature-desc {
      font-size: 12px;
      color: #64748b;
    }

    /* Action Buttons */
    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin: 40px 0;
      flex-wrap: wrap;
    }

    .primary-btn {
      background: linear-gradient(135deg, #1e40af, #1d4ed8);
      color: white;
      padding: 16px 32px;
      border-radius: 50px;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.3);
      border: none;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      text-transform: none;
    }

    .primary-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.4);
      background: linear-gradient(135deg, #1e3a8a, #1e40af);
    }

    .secondary-btn {
      background: rgba(255, 255, 255, 0.9);
      color: #1e40af;
      padding: 16px 32px;
      border-radius: 50px;
      font-size: 16px;
      font-weight: 600;
      border: 2px solid rgba(30, 64, 175, 0.2);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      text-transform: none;
    }

    .secondary-btn:hover {
      background: rgba(30, 64, 175, 0.1);
      border-color: rgba(30, 64, 175, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.15);
    }

    /* Additional Info */
    .additional-info {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin-top: 32px;
      flex-wrap: wrap;
    }

    .info-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: rgba(34, 197, 94, 0.1);
      color: #16a34a;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 500;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }

    .info-badge mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    /* Stats Container */
    .stats-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-left: 40px;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      min-width: 200px;
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .card-1 {
      animation: slideInRight 1s ease-out 0.2s both;
    }

    .card-2 {
      animation: slideInRight 1s ease-out 0.4s both;
    }

    .card-3 {
      animation: slideInRight 1s ease-out 0.6s both;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .stat-content {
      text-align: left;
    }

    .stat-number {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
      font-weight: 500;
    }

    /* Footer */
    .footer-info {
      position: relative;
      z-index: 2;
      background: rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-content {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
    }

    .footer-links {
      display: flex;
      gap: 24px;
    }

    .footer-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-link:hover {
      color: rgba(255, 255, 255, 1);
    }

    /* Animations */
    @keyframes float {
      0%, 100% {
        transform: translateX(0px) translateY(0px) rotate(0deg);
      }
      33% {
        transform: translateX(30px) translateY(-30px) rotate(120deg);
      }
      66% {
        transform: translateX(-20px) translateY(20px) rotate(240deg);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
    }

    @keyframes slideInRight {
      0% {
        transform: translateX(50px);
        opacity: 0;
      }
      100% {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .hero-section {
        padding: 32px 16px;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 24px 16px;
      }

      .welcome-card {
        padding: 32px 24px;
      }

      .brand-title {
        font-size: 28px;
      }

      .hero-title {
        font-size: 24px;
      }

      .hero-description {
        font-size: 16px;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .actions {
        flex-direction: column;
        align-items: center;
      }

      .primary-btn,
      .secondary-btn {
        width: 100%;
        justify-content: center;
        max-width: 300px;
      }

      .stats-container {
        width: 100%;
      }

      .stat-card {
        min-width: auto;
        flex: 1;
      }

      .footer-content {
        text-align: center;
      }

      .additional-info {
        flex-direction: column;
        align-items: center;
      }
    }

    @media (max-width: 480px) {
      .brand-logo {
        margin-bottom: 12px;
      }

      .logo-image {
        height: 60px;
      }

      .brand-title {
        font-size: 24px;
      }

      .hero-title {
        font-size: 20px;
      }

      .feature-item {
        flex-direction: column;
        text-align: center;
        padding: 16px;
      }

      .feature-text {
        text-align: center;
      }
    }
  `]
})
export class HomeComponent {}
