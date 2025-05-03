<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // 'sales', 'inventory', 'customer', etc.
            $table->json('parameters'); // Store parameters used to generate the report
            $table->json('data'); // Store the actual report data
            $table->dateTime('period_start');
            $table->dateTime('period_end');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // Who created it
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
