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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->string('order_id')->unique(); // e.g., ORD-2023-001
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->decimal('total_amount', 10, 2);
            $table->integer('item_count');
            $table->enum('status', ['Processing', 'Shipped', 'Completed', 'Cancelled'])->default('Processing');
            $table->string('payment_method');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
