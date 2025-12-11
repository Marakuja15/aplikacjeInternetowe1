<?php

/** @var \App\Model\Category $category */
/** @var \App\Service\Router $router */

$title = 'Edit Category ' . $category->getName();
$bodyClass = "edit";

ob_start(); ?>
    <h1>Edit Category</h1>
    <form action="<?= $router->generatePath('category-edit') ?>" method="post">
        <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
        <input type="hidden" name="action" value="category-edit">
        <input type="hidden" name="id" value="<?= $category->getId() ?>">
        <input type="submit" value="Update">
    </form>

    <a href="<?= $router->generatePath('category-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
