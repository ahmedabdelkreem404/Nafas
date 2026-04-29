<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            abort(401, 'Unauthorized');
        }

        if ($request->user()->role === 'super_admin') {
            return $next($request); // Super admin can do anything
        }

        if (empty($roles)) {
            // Just check if they are any kind of admin
            if (in_array($request->user()->role, ['admin', 'inventory_manager', 'order_manager', 'content_manager'])) {
                return $next($request);
            }
        } elseif ($request->user()->hasRole($roles)) {
            return $next($request);
        }

        abort(403, 'Forbidden');
    }
}
