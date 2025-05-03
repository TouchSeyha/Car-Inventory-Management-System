import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import React from 'react';

interface PaginationProps {
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
    className?: string;
}

export function Pagination({ meta, className = '' }: PaginationProps) {
    // Don't render pagination if there's only one page
    if (meta.last_page <= 1) {
        return null;
    }

    // Clean up link labels by removing HTML entities
    const links = meta.links.map(link => ({
        ...link,
        label: link.label.replace(/&laquo;|&raquo;/g, '').trim()
    }));

    const hasPrevious = meta.current_page > 1;
    const hasNext = meta.current_page < meta.last_page;

    return (
        <nav
            className={`flex items-center justify-between px-4 py-3 sm:px-0 ${className}`}
            aria-label="Pagination"
        >
            <div className="hidden sm:block">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{meta.from}</span> to{' '}
                    <span className="font-medium">{meta.to}</span> of{' '}
                    <span className="font-medium">{meta.total}</span> results
                </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
                <div className="flex items-center space-x-1">
                    {/* Previous button */}
                    {hasPrevious ? (
                        <Link
                            href={links[0].url || '#'}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    ) : (
                        <span className="inline-flex cursor-not-allowed items-center rounded-md border border-gray-300 bg-gray-100 px-2 py-2 text-sm font-medium text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500">
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                    )}

                    {/* Page numbers */}
                    {links.slice(1, -1).map((link, index) => {
                        if (link.label === '...') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="inline-flex items-center px-1 text-gray-500 dark:text-gray-400"
                                >
                                    <MoreHorizontalIcon className="h-5 w-5" />
                                </span>
                            );
                        }

                        if (link.active) {
                            return (
                                <span
                                    key={`page-${link.label}`}
                                    aria-current="page"
                                    className="inline-flex items-center rounded-md border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                                >
                                    {link.label}
                                </span>
                            );
                        }

                        return (
                            <Link
                                key={`page-${link.label}`}
                                href={link.url || '#'}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                {link.label}
                            </Link>
                        );
                    })}

                    {/* Next button */}
                    {hasNext ? (
                        <Link
                            href={links[links.length - 1].url || '#'}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </Link>
                    ) : (
                        <span className="inline-flex cursor-not-allowed items-center rounded-md border border-gray-300 bg-gray-100 px-2 py-2 text-sm font-medium text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500">
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
}
