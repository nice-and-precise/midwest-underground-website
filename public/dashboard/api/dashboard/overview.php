<?php
/**
 * Dashboard Overview API
 * Returns main dashboard KPIs and summary data
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Load data files
$projectsData = json_decode(file_get_contents('../data/projects.json'), true);
$customersData = json_decode(file_get_contents('../data/customers.json'), true);
$financialsData = json_decode(file_get_contents('../data/financials.json'), true);
$equipmentData = json_decode(file_get_contents('../data/equipment.json'), true);

// Calculate KPIs
$activeProjects = array_filter($projectsData['projects'], function($p) {
    return $p['status'] === 'In Progress';
});

$completedProjects = array_filter($projectsData['projects'], function($p) {
    return $p['status'] === 'Completed';
});

$plannedProjects = array_filter($projectsData['projects'], function($p) {
    return $p['status'] === 'Planning';
});

// Revenue YTD
$revenueYTD = $financialsData['year_to_date']['revenue'];
$profitYTD = $financialsData['year_to_date']['profit'];
$profitMargin = $financialsData['year_to_date']['profit_margin'];

// Current month (October 2024)
$currentMonth = $financialsData['monthly_revenue'][count($financialsData['monthly_revenue']) - 1];
$previousMonth = $financialsData['monthly_revenue'][count($financialsData['monthly_revenue']) - 2];

$revenueChange = (($currentMonth['revenue'] - $previousMonth['revenue']) / $previousMonth['revenue']) * 100;
$profitChange = (($currentMonth['profit'] - $previousMonth['profit']) / $previousMonth['profit']) * 100;

// Top customers by revenue
$customers = $customersData['customers'];
usort($customers, function($a, $b) {
    return $b['total_revenue'] - $a['total_revenue'];
});
$topCustomers = array_slice($customers, 0, 5);

// Recent activity
$recentProjects = array_slice($projectsData['projects'], 0, 5);

// Overdue invoices
$overdueInvoices = array_filter($financialsData['accounts_receivable'], function($ar) {
    return $ar['status'] === 'Overdue';
});

// Build response
$response = [
    'success' => true,
    'timestamp' => date('Y-m-d H:i:s'),
    'data' => [
        'kpis' => [
            'revenue_ytd' => [
                'value' => $revenueYTD,
                'formatted' => '$' . number_format($revenueYTD),
                'change' => round($financialsData['year_over_year']['revenue_growth'], 1),
                'trend' => 'up',
                'label' => 'Revenue YTD'
            ],
            'active_projects' => [
                'value' => count($activeProjects),
                'change' => 12.5,
                'trend' => 'up',
                'label' => 'Active Projects'
            ],
            'profit_margin' => [
                'value' => $profitMargin,
                'formatted' => $profitMargin . '%',
                'change' => 2.1,
                'trend' => 'up',
                'label' => 'Profit Margin'
            ],
            'total_customers' => [
                'value' => count($customersData['customers']),
                'change' => 8.3,
                'trend' => 'up',
                'label' => 'Total Customers'
            ],
            'cash_on_hand' => [
                'value' => $financialsData['cash_flow']['cash_on_hand'],
                'formatted' => '$' . number_format($financialsData['cash_flow']['cash_on_hand']),
                'change' => 5.2,
                'trend' => 'up',
                'label' => 'Cash on Hand'
            ],
            'equipment_utilization' => [
                'value' => $equipmentData['equipment_summary']['avg_utilization_rate'],
                'formatted' => $equipmentData['equipment_summary']['avg_utilization_rate'] . '%',
                'change' => 3.4,
                'trend' => 'up',
                'label' => 'Equipment Utilization'
            ]
        ],
        'project_status' => [
            'in_progress' => count($activeProjects),
            'completed' => count($completedProjects),
            'planning' => count($plannedProjects),
            'total' => count($projectsData['projects'])
        ],
        'revenue_by_service' => [
            [
                'service' => 'Fiber Optic',
                'revenue' => 1850000,
                'percentage' => 43.5
            ],
            [
                'service' => 'Directional Drilling',
                'revenue' => 1275000,
                'percentage' => 30.0
            ],
            [
                'service' => 'Underground Utilities',
                'revenue' => 850000,
                'percentage' => 20.0
            ],
            [
                'service' => 'Geothermal',
                'revenue' => 198000,
                'percentage' => 4.7
            ],
            [
                'service' => 'Emergency Services',
                'revenue' => 77000,
                'percentage' => 1.8
            ]
        ],
        'top_customers' => array_map(function($c) {
            return [
                'name' => $c['name'],
                'type' => $c['type'],
                'revenue' => $c['total_revenue'],
                'projects' => $c['total_projects'],
                'active_projects' => $c['active_projects']
            ];
        }, $topCustomers),
        'recent_projects' => array_map(function($p) {
            return [
                'id' => $p['id'],
                'name' => $p['name'],
                'customer' => $p['customer_name'],
                'status' => $p['status'],
                'completion' => $p['completion_percentage'],
                'budget' => $p['budget']
            ];
        }, $recentProjects),
        'alerts' => [
            [
                'type' => 'warning',
                'title' => 'Overdue Invoices',
                'message' => count($overdueInvoices) . ' invoice(s) overdue - $' . number_format(array_sum(array_column($overdueInvoices, 'amount'))),
                'action_url' => '/dashboard/financials.html#invoices'
            ],
            [
                'type' => 'info',
                'title' => 'Equipment Maintenance',
                'message' => $equipmentData['equipment_summary']['maintenance_due_within_30_days'] . ' equipment items due for maintenance',
                'action_url' => '/dashboard/equipment.html#maintenance'
            ]
        ],
        'monthly_revenue_trend' => array_slice($financialsData['monthly_revenue'], -12)
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
