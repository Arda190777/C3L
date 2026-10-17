/** @file pages.js
 * @brief Exports the two page views used by the attendance router.
 */
// This is a common import point: router.js can import both views from './pages'.
// Each view stays in its own file for team ownership; these lines re-export functions
// without rendering a page or querying the database themselves.
export { renderForm } from './formPage'
export { renderHistory } from './historyPage'
