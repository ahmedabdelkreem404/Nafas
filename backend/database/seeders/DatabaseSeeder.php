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

        if (app()->environment(['local', 'testing']) && env('NAFAS_SEED_ADMIN_EMAIL') && env('NAFAS_SEED_ADMIN_PASSWORD')) {
            User::updateOrCreate(
                ['email' => env('NAFAS_SEED_ADMIN_EMAIL')],
                [
                    'name' => env('NAFAS_SEED_ADMIN_NAME', 'Local Nafas Admin'),
                    'password' => bcrypt(env('NAFAS_SEED_ADMIN_PASSWORD')),
                    'role' => 'super_admin',
                ]
            );
        }

        $this->call([
            ProductSeeder::class,
            ContentSeeder::class,
        ]);
    }
}
