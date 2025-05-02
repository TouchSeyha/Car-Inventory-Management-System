<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventory>
 */
class InventoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Sedan', 'SUV', 'Truck', 'Luxury', 'Electric', 'Sports'];
        $makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes-Benz', 'Tesla', 'Audi'];
        
        $stock = fake()->numberBetween(0, 10);
        $status = $stock === 0 ? 'Out of Stock' : ($stock <= 2 ? 'Low Stock' : 'In Stock');
        
        return [
            'name' => fake()->randomElement($makes) . ' ' . fake()->word(),
            'category' => fake()->randomElement($categories),
            'year' => fake()->numberBetween(2020, 2024),
            'make' => fake()->randomElement($makes),
            'model' => fake()->word() . ' ' . fake()->randomLetter() . fake()->numberBetween(1, 9),
            'stock' => $stock,
            'price' => fake()->randomFloat(2, 20000, 100000),
            'status' => $status,
            'imageurl' => fake()->imageUrl(640, 480, 'cars'),
            'description' => fake()->paragraph(),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }

    /**
     * Indicate that the model is in stock.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function inStock()
    {
        return $this->state(function (array $attributes) {
            return [
                'stock' => fake()->numberBetween(3, 10),
                'status' => 'In Stock',
            ];
        });
    }

    /**
     * Indicate that the model is low in stock.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function lowStock()
    {
        return $this->state(function (array $attributes) {
            return [
                'stock' => fake()->numberBetween(1, 2),
                'status' => 'Low Stock',
            ];
        });
    }

    /**
     * Indicate that the model is out of stock.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function outOfStock()
    {
        return $this->state(function (array $attributes) {
            return [
                'stock' => 0,
                'status' => 'Out of Stock',
            ];
        });
    }
}
