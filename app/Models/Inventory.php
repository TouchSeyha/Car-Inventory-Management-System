<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'inventory';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'category',
        'year',
        'make',
        'model',
        'stock',
        'price',
        'status',
        'imageurl',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'year' => 'integer',
        'stock' => 'integer',
        'price' => 'decimal:2',
    ];

    /**
     * Update the stock level and status automatically
     * 
     * @param int $quantity
     * @return void
     */
    public function decrementStock(int $quantity = 1): void
    {
        $this->stock = max(0, $this->stock - $quantity);
        $this->updateStatus();
        $this->save();
    }

    /**
     * Increment stock and update status
     * 
     * @param int $quantity
     * @return void
     */
    public function incrementStock(int $quantity = 1): void
    {
        $this->stock += $quantity;
        $this->updateStatus();
        $this->save();
    }

    /**
     * Update status based on stock level
     * 
     * @return void
     */
    private function updateStatus(): void
    {
        if ($this->stock <= 0) {
            $this->status = 'Out of Stock';
        } elseif ($this->stock <= 2) {
            $this->status = 'Low Stock';
        } else {
            $this->status = 'In Stock';
        }
    }
}
