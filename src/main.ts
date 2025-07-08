import { bootstrapApplication } from "@angular/platform-browser"
import { AppComponent } from "./app/app.component"
import { provideRouter } from "@angular/router"
import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { provideAnimations } from "@angular/platform-browser/animations"
import { routes } from "./app/app.routes"
import { authInterceptor } from "./app/interceptors/auth.interceptor"
import { loadingInterceptor } from "./app/interceptors/loading.interceptor"
import { errorInterceptor } from "./app/interceptors/error.interceptor"

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor])),
    provideAnimations(),
  ],
}).catch((err) => console.error(err))
