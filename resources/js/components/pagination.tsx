import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect } from 'react';

interface PaginationProps {
    meta: {
        current_page: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
}

export function Pagination({ meta }: PaginationProps) {
    // Debugging: log meta data to console
    useEffect(() => {
        console.log('Pagination meta data:', meta);
    }, [meta]);

    // Handle edge cases
    if (!meta || !meta.links || meta.links.length <= 3) {
        return null;
    }

    const { current_page, last_page, links } = meta;

    // Get the current URL and search parameters
    const currentUrl = new URL(window.location.href);
    const searchParams = Object.fromEntries(currentUrl.searchParams.entries());

    // Function to build pagination URLs that preserve existing query params
    const buildPaginationUrl = (page: number | null) => {
        if (!page) return '#';

        // Start with current search params and add/update page parameter
        const params = { ...searchParams, page: String(page) };

        // Build full URL using current path and search params
        const url = new URL(currentUrl);

        // Clear existing search params
        url.search = '';

        // Add all params to the URL
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        return url.toString();
    };

    // Generate page numbers to display
    const generatePageNumbers = () => {
        const pageNumbers = [];
        const maxPagesShown = 5; // Max number of page links to show

        // Logic to determine which page numbers to show
        let startPage = Math.max(1, current_page - Math.floor(maxPagesShown / 2));
        let endPage = startPage + maxPagesShown - 1;

        if (endPage > last_page) {
            endPage = last_page;
            startPage = Math.max(1, endPage - maxPagesShown + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex items-center justify-between">
            <div className="text-muted-foreground hidden flex-1 text-sm md:flex">
                Showing page {current_page} of {last_page}
            </div>
            <div className="flex items-center justify-center gap-1">
                {/* First page button */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={current_page <= 1}
                    as={Link}
                    href={buildPaginationUrl(1)}
                    preserveScroll
                    title="First Page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                    <span className="sr-only">First Page</span>
                </Button>

                {/* Previous page button */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={current_page <= 1}
                    as={Link}
                    href={buildPaginationUrl(current_page > 1 ? current_page - 1 : null)}
                    preserveScroll
                    title="Previous Page"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                </Button>

                {/* Numbered page buttons */}
                <div className="hidden gap-1 sm:flex">
                    {pageNumbers.map((page) => (
                        <Button
                            key={page}
                            variant={page === current_page ? 'default' : 'outline'}
                            size="sm"
                            as={Link}
                            href={buildPaginationUrl(page)}
                            preserveScroll
                            className={page === current_page ? 'pointer-events-none' : ''}
                        >
                            {page}
                        </Button>
                    ))}
                </div>

                {/* Mobile page indicator */}
                <span className="px-2 text-sm font-medium sm:hidden">
                    {current_page} / {last_page}
                </span>

                {/* Next page button */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={current_page >= last_page}
                    as={Link}
                    href={buildPaginationUrl(current_page < last_page ? current_page + 1 : null)}
                    preserveScroll
                    title="Next Page"
                >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                </Button>

                {/* Last page button */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={current_page >= last_page}
                    as={Link}
                    href={buildPaginationUrl(last_page)}
                    preserveScroll
                    title="Last Page"
                >
                    <ChevronsRight className="h-4 w-4" />
                    <span className="sr-only">Last Page</span>
                </Button>
            </div>
        </div>
    );
}
