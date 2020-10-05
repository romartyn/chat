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
		// DB::unprepared("TRUNCATE users");

		DB::table('users')->insert([
			'name' => 'Главный Юзер',
			'email' => 'first@chat',
			'password' => bcrypt('111'),
			'role' => 'super',
			'created_at' => date('Y-m-d H:i:s'),
			'updated_at' => date('Y-m-d H:i:s'),
		]);

		DB::table('users')->insert([
			'name' => 'Второй Юзер',
			'email' => 'second@chat',
			'password' => bcrypt('222'),
			'role' => 'super',
			'created_at' => date('Y-m-d H:i:s'),
			'updated_at' => date('Y-m-d H:i:s'),
		]);

	}
}
