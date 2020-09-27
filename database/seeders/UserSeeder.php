<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use DB;

class UserSeeder extends Seeder
{
	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		DB::unprepared("TRUNCATE users");

		DB::table('users')->insert([
			'name' => 'Администратор',
			'email' => 'romartyn@yandex.ru',
			'password' => bcrypt('nV9fI6iF4qF7qH7y'),
			'role' => 'super',
			'created_at' => date('Y-m-d H:i:s'),
			'updated_at' => date('Y-m-d H:i:s'),
		]);

	}
}
