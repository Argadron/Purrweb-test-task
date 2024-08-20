import { DynamicModule, INestApplication, Module } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

@Module({

})
export class SwaggerModuleLocal {
    static forRoot(app: INestApplication): DynamicModule {
        const swaggerConfig = new DocumentBuilder()
        .setTitle("Trello test task API")
        .setDescription("Documentation trello test task API")
        .setVersion(process.env.API_VERSION)
        .addBearerAuth({
            type: "http",
            bearerFormat: "JWT",
            in: "header",
            scheme: "bearer",
            name: "JWT",
            description: "Enter your access jwt token",
          }).build()
        const document = SwaggerModule.createDocument(app, swaggerConfig)
        SwaggerModule.setup("/swagger", app, document)

        return {
            module: SwaggerModuleLocal
        }
    }
}