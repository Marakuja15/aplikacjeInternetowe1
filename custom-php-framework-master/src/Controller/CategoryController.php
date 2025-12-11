<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Category;
use App\Service\Router;
use App\Service\Templating;

class CategoryController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $categories = Category::findAll();
        $html = $templating->render('category/index.html.php', [
            'categories' => $categories,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestCategory, Templating $templating, Router $router): ?string
    {
        if ($requestCategory) {
            $category = Category::fromArray($requestCategory);
            $category->save();

            $path = $router->generatePath('category-index');
            $router->redirect($path);
            return null;
        } else {
            $category = new Category();
        }

        $html = $templating->render('category/create.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $categoryId, ?array $requestCategory, Templating $templating, Router $router): ?string
    {
        $category = Category::find($categoryId);
        if (! $category) {
            throw new NotFoundException("Missing category with id $categoryId");
        }

        if ($requestCategory) {
            $category->fill($requestCategory);
            $category->save();

            $path = $router->generatePath('category-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('category/edit.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $categoryId, Templating $templating, Router $router): ?string
    {
        $category = Category::find($categoryId);
        if (! $category) {
            throw new NotFoundException("Missing category with id $categoryId");
        }

        $html = $templating->render('category/show.html.php', [
            'category' => $category,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $categoryId, Router $router): ?string
    {
        $category = Category::find($categoryId);
        if (! $category) {
            throw new NotFoundException("Missing category with id $categoryId");
        }

        $category->delete();
        $path = $router->generatePath('category-index');
        $router->redirect($path);
        return null;
    }
}
