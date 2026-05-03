<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $seedAdminEmail = env('NAFAS_SEED_ADMIN_EMAIL', 'admin@nafas.com');
        $seedAdminPassword = env('NAFAS_SEED_ADMIN_PASSWORD', 'password123');

        if (app()->environment(['local', 'testing']) && $seedAdminEmail && $seedAdminPassword) {
            User::updateOrCreate(
                ['email' => $seedAdminEmail],
                [
                    'name' => env('NAFAS_SEED_ADMIN_NAME', 'Local Nafas Admin'),
                    'password' => bcrypt($seedAdminPassword),
                    'role' => 'super_admin',
                ]
            );
        }

        $this->call([
            ProductSeeder::class,
            CatalogSeeder::class,
            HomepageSeeder::class,
            ContentSeeder::class,
        ]);
    }
}
